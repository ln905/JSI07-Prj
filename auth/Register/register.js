document.getElementById("logo_container").addEventListener("click", () => {
  window.location.href = "../../index.html";
})

//Nav
function openNav() {
  document.getElementById("sidenav").style.width = "250px";
}

function closeNav() {
  document.getElementById("sidenav").style.width = "0";
}


function openTopNav() {
  document.getElementById("topnav").style.height = "20%";
  document.getElementById("topnav").style.width = "40%";
  document.getElementById("expand_btn").removeEventListener("click", openTopNav);
  document.getElementById("expand_btn").addEventListener("click", closeTopNav)
}

function closeTopNav() {
  document.getElementById("topnav").style.height = "0";
  document.getElementById("topnav").style.width = "0";
  document.getElementById("expand_btn").removeEventListener("click", closeTopNav);
  document.getElementById("expand_btn").addEventListener("click", openTopNav);
}

document.getElementById("expand_btn").addEventListener("click", openTopNav)


// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBx4gtyI8TsZ8E1P6Uvp8IAW1UDShIDLY0",
  authDomain: "jsi-07.firebaseapp.com",
  projectId: "jsi-07",
  storageBucket: "jsi-07.appspot.com",
  messagingSenderId: "300916716059",
  appId: "1:300916716059:web:9fa50d48fe9013bc71bebe",
  measurementId: "G-66M7ET89KT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

//register
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
const auth = getAuth(app);

document.getElementById("register").addEventListener("click", function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const re_password = document.getElementById("re-password").value;
  const username = document.getElementById("username").value;

  if (password !== re_password){
    alert("Your password does not match, please try again!")
  } else {
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      const uid = user.uid; 
      localStorage.setItem("id", uid);
      localStorage.setItem("mail", email);
      localStorage.setItem("username", username);
      AddUser_customID();
      alert('The account has been created successfully');
      window.location.href = "../../index.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    });    
  }
})


//add user in4 after sign up 
import {doc, getDoc, setDoc, getFirestore} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js"; 
const db = getFirestore();

async function AddUser_customID() {
  await setDoc(doc(db, "User Info", localStorage.getItem("id")), {
    email: localStorage.getItem("mail"),
    role: "reader",
    name: localStorage.getItem("username"),
  });
}

///////////////CHECK USER ID////////////////
if (localStorage.getItem("id")==null){
  document.getElementById("writer").style ='visibility: hidden; display:none';
  document.getElementById("signout").style ='visibility: hidden; display:none';
  // alert(`You are not logged in or you don't have permission to access to this document`)
  // window.location.href = "auth/Login/index.html";
} else {
  alert(`You've already logged in`)
  window.location.href = "../../index.html";
}