// const firebase = require("firebase-admin");
// const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
// const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

// const serviceAccount = require("./delivery-bots-firebase-adminsdk-dai3s-000495197d.json");

// const app = initializeApp({
//     credential: cert(serviceAccount),
//     databaseURL: "https://delivery-bots-default-rtdb.firebaseio.com"
// });

// const db = getFirestore(app);

// const { initializeApp } = require("firebase-admin/app");
// const { getFirestore } = require('firebase-admin/firestore');
const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDXUHeNLadntNLPZ1CxOPEEudjTDXMTIsU",
    authDomain: "delivery-bots.firebaseapp.com",
    databaseURL: "https://delivery-bots-default-rtdb.firebaseio.com",
    projectId: "delivery-bots",
    storageBucket: "delivery-bots.appspot.com",
    messagingSenderId: "1000726954204",
    appId: "1:1000726954204:web:cd0e5f57814b6a69937419"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports = db;


