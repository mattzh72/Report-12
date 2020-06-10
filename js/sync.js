const COLLECTION = "metadata";
const DOCUMENT = "email_counter";
const FIELD = "count";

var firebaseConfig = {
apiKey: "AIzaSyD_pYfePROuVl9Gzq0CiMSpQLT6o8kuhSg",
authDomain: "blm-email-template-gen.firebaseapp.com",
databaseURL: "https://blm-email-template-gen.firebaseio.com",
projectId: "blm-email-template-gen",
storageBucket: "blm-email-template-gen.appspot.com",
messagingSenderId: "921240614997",
appId: "1:921240614997:web:16acbf8b7089c9dadcbcdc",
measurementId: "G-LC58ZTM4W6"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

var db = firebase.firestore();

function getNumEmails() {
    return db.collection(COLLECTION).doc(DOCUMENT).get().then(doc => {
        return doc.data()[FIELD];
    });
}

function addNumEmails(num) {
    return db.collection(COLLECTION).doc(DOCUMENT).get().then(doc => {
        let newTotal = doc.data()[FIELD] + num;
        db.collection(COLLECTION).doc(DOCUMENT).set({
            [FIELD]: newTotal
        });
        
        return newTotal;
    });
}


//function
//db.collection("cities").doc("LA").set({
//    name: "Los Angeles",
//    state: "CA",
//    country: "USA"
//})
//.then(function() {
//    console.log("Document successfully written!");
//})
//.catch(function(error) {
//    console.error("Error writing document: ", error);
//});