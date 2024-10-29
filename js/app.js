
const firebaseApp = firebase.initializeApp({
    apiKey: [DIN INFO HER] ,
    authDomain: [DIN INFO HER] ,
    projectId: [DIN INFO HER] ,
    storageBucket: [DIN INFO HER] ,
    messagingSenderId: [DIN INFO HER] ,
    appId: [DIN INFO HER] 
});
///////////////////////////////////////////////////////////

/* Firebase config */
const db = firebaseApp.firestore();
let docid = "";

function addItem() {
    const title = document.getElementById("title").value;
    const year = document.getElementById("year").value;
    console.log("hei")
    db.collection("movies").doc(title).set({
        title: title,
        year: year
    })
    document.getElementById("title").value = ""; 
    document.getElementById("year").value = ""; 
}

