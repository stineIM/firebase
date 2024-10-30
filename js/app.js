
const firebaseApp = firebase.initializeApp({
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
});
///////////////////////////////////////////////////////////

/* Firebase config */
const db = firebaseApp.firestore();

// Legger til element i collection "movies"
function addItem() {
    const title = document.getElementById("title").value;
    const year = document.getElementById("year").value;
    const image = document.getElementById("image").value;

    db.collection("movies").doc(title).set({
        title: title,
        year: year,
        image: image
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
    db.collection("movies").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            items += "<div class='movie-card'>" +
                "<img src='" + data.image + "' alt='" + data.title + "'>" +
                "<div>" +
                "<h2>" + data.title + "</h2>" +
                "<p>År: " + data.year + "</p>" +
                "</div>" +
                "</div>";
        });
        document.getElementById("itemTable").innerHTML = items;
    });
}
getItems();
