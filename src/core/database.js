import firebase from 'firebase';

const config = {
  apiKey: "AIzaSyCYB_NmZJmnxPTWcG1gWTw7HaZbrjEk6rk",
  authDomain: "cleancode-d4922.firebaseapp.com",
  databaseURL: "https://cleancode-d4922.firebaseio.com",
  storageBucket: "cleancode-d4922.appspot.com"
}

firebase.initializeApp(config);
const database = firebase.database();

export default database;
