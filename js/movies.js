
const firebaseApp = firebase.initializeApp({

});
///////////////////////////////////////////////////////////

/* Firebase config */
const db = firebaseApp.firestore();
const auth = firebase.auth(); // Firebase Authentication
let docid = "";

auth.onAuthStateChanged((user) => {
    if (user) {
        console.log("Brukeren er logget inn:", user.email);
        getItems(); // Hent elementene hvis brukeren er logget inn
    } else {
        // Hvis brukeren ikke er logget inn, omdiriger til innloggingssiden
        window.location.href = "login.html";
    }
});

// Legger til element i collection "movies"
function addItem() {
    const title = document.getElementById("title").value;
    const year = document.getElementById("year").value;
    const image = document.getElementById("image").value;
    let userid = sessionStorage.getItem("uid");
    let category = document.getElementsByName("category"); 
    let categories = [];
    for (let i=0; i < category.length; i++) {
        if(category[i].checked) {
            categories.push(category[i].value);
        }
    }

    db.collection("movies").doc(title).set({
        title: title,
        year: year,
        image: image,
        category: categories, 
        userid:userid
    }).then(() => {
        getItems(); // Hent filmene på nytt etter at en ny film er lagt til
    });

    document.getElementById("title").value = "";
    document.getElementById("year").value = "";
    document.getElementById("image").value = "";
}

// Henter ut data frå collection som heiter movies. Feltene image, title og year er i kvart dokument i databasen. 
function getItems() {
    let items = "";
    let userid = sessionStorage.getItem("uid"); // Henter ut userid som er lagra i sessionStorage
    db.collection("movies").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            docid = "'" + doc.id + "'";          
            const data = doc.data();
            // Sjekker om userid i databasen er det same som userid som er logga inn
            if (doc.data().userid == userid) {
                items += "<div class='movie-card'>" +
                "<div><img src='" + data.image + "' alt='" + data.title + "'></div>" +
                "<div>" +
                "<h2>" + data.title + "</h2>" +
                "<p>År: " + data.year + "</p>" +
                "</div>" + 
                "<div class='icons'>" + 
                '<i class="fas fa-edit edit-icon" onclick="showUpdateForm(' + docid + ')"></i>' +
                '<i class="fas fa-trash delete-icon" onclick="removeMovie(' + docid + ')"></i>' +
                "</div>" +
                "</div>" +
                "</div>";
            }
            
        
            for (let i=0; i< doc.data().category.length; i++) {
               
            }

        });
        document.getElementById("itemTable").innerHTML = items;
    });
}
getItems();

function updateMovie(docid) {
    var movie = db.collection("movies").doc(docid);
    const title = document.getElementById("inptitle").value;
    const year = document.getElementById("inpyear").value;
    const image = document.getElementById("inpimage").value;

    // Oppdater filmen i firestore
    return movie.update({
        title: title,
        year: year,
        image: image
    })
        .then(() => {
            console.log("Document successfully updated!");
            // Redirecter til index.html 
            window.location.href = "./index.html";
        })
        .catch((error) => {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
}

// Denne viser brukeren sin informasjon som ligger i databasen.
function showUpdateForm(docid) {
    document.getElementById("userform").style.display = "block";
    let category = document.getElementsByName("category"); 
    document.getElementById("btnUpdate").onclick = function () { updateMovie(docid) };
    db.collection("movies").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // Sjekker om doc-iden er den samme for den brukaren me skal redigere 
            if (docid == doc.id) {
                document.getElementById("inptitle").value = doc.data().title;
                document.getElementById("inpyear").value = doc.data().year;
                document.getElementById("inpimage").value = doc.data().image;

                // Går igjennom hver kategori og sjekker om den finnes i databasen
                for (let i=0; i < category.length ; i++) {
                    for (let j=0; j<doc.data().category.length;j++) {
                        if (category[i].value == doc.data().category[j]) {
                            console.log(category[i].value); 
                            category[i].checked = true; 
                        }
                    }
                }
            }
        });
    })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
}

// SLETTE ELEMENT I DATABASE 
// Docid er dokument-id
function removeMovie(docid) {
    db.collection("movies").doc(docid).delete().then(() => {
        console.log("Document successfully deleted!");
        alert("Film er slettet");
        window.location.href="index.html";
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });
}

