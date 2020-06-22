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

function getNumEmails(abbreviate=true) {
    return db.collection(COLLECTION).doc(DOCUMENT).get().then(doc => {
        return abbreviate ? abbreviateNumber(doc.data()[FIELD], 0) : doc.data()[FIELD];
    });
}

function incrementEmailCount(num=1, abbreviate=true) {
    return db.collection(COLLECTION).doc(DOCUMENT).get().then(doc => {
        let newTotal = doc.data()[FIELD] + num;
        console.log(doc.data()[FIELD]);
        console.log(num);
        db.collection(COLLECTION).doc(DOCUMENT).set({
            [FIELD]: newTotal
        });
        
        return abbreviate ? abbreviateNumber(newTotal, 0) : newTotal;   
    });
}

function abbreviateNumber(num, fixed) {
  if (num === null) { return null; } // terminate early
  if (num === 0) { return '0'; } // terminate early
  fixed = (!fixed || fixed < 0) ? 0 : fixed; // number of decimal places to show
  var b = (num).toPrecision(2).split("e"), // get power
      k = b.length === 1 ? 0 : Math.floor(Math.min(b[1].slice(1), 14) / 3), // floor at decimals, ceiling at trillions
      c = k < 1 ? num.toFixed(0 + fixed) : (num / Math.pow(10, k * 3) ).toFixed(1 + fixed), // divide by power
      d = c < 0 ? c : Math.abs(c), // enforce -0 is 0
      e = d + ['', 'K', 'M', 'B', 'T'][k]; // append power
  return e;
}
