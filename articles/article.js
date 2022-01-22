document.getElementById("logo_container").addEventListener("click", () => {
    window.location.href = "../index.html";
})

//Nav
function openNav() {
    document.getElementById("sidenav").style.width = "250px";
}
document.getElementById("categories_img").addEventListener("click", openNav)
  
function closeNav() {
    document.getElementById("sidenav").style.width = "0";
}
document.getElementById("closebtn").addEventListener("click", closeNav)

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


//Lay id 
var url_string = window.location;
var url = new URL(url_string);
var tvid = url.searchParams.get("id");
console.log(tvid);
localStorage.setItem("tvid", tvid);

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//FIRESTORE
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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



//Import Firebase
import {doc, getDoc, getFirestore, updateDoc} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js"; 
const db = getFirestore();

//get article information
async function GetADocument() {
    var ref = doc(db, "Articles", localStorage.getItem("tvid"));
    const docSnap = await getDoc(ref);
  
    if (docSnap.exists()) {
      let content = docSnap.data().content;
      let category = docSnap.data().category;
      let curStatus = docSnap.data().status;
      let view = docSnap.data().view
      document.title = content[0].text
      localStorage.setItem("tvid_content", JSON.stringify(content));
      localStorage.setItem("view", view);
      GenerateArticle()
    } else {
      alert("No such Document");
    }
}
GetADocument()

function GenerateArticle() {
let content = JSON.parse(localStorage.getItem("tvid_content"))
console.log(content); 
    for (let i = 0; i < content.length; i++) {
        if (content[i].type == 'input_title'){
            document.getElementById("content").innerHTML += `
            <h1 id="article_title" class="article_title">${content[i].text}</h1>
            `
        }
        else if (content[i].type == 'input_description'){
            document.getElementById("content").innerHTML += `
            <h3 id="article_top_description" class="article_description">${content[i].text}</h3>
            `
        }
        else if (content[i].type == 'input_text'){
            document.getElementById("content").innerHTML += `
            <h2 id="article_text" class="article_text">${content[i].text}</h2>
            `
        }
        else if (content[i].type == 'input_image'){
            document.getElementById("content").innerHTML += `
            <img src="${content[i].text}" class="article_image" alt="">            `
        }
    }
    UpdateView()
}

///////////////CHECK USER ID////////////////
async function CheckId() {
    var ref = doc(db, "User Info", localStorage.getItem("id"));
    const docSnap = await getDoc(ref);
  
    if (docSnap.exists()) { 
      let role = docSnap.data().role;
        
        if (role != "writer" && role != "reader") {
            alert(`You are not logged in or you don't have permission to access to this document`)
            window.location.href = "auth/Login/index.html";
        }else if(role == "writer") {
            document.getElementById("account").innerHTML = docSnap.data().name   
            document.getElementById("signin").style ='visibility: hidden; display:none';
            document.getElementById("signup").style ='visibility: hidden; display:none' 
        } else {
            document.getElementById("account").innerHTML = docSnap.data().name   
            document.getElementById("signin").style ='visibility: hidden; display:none';
            document.getElementById("signup").style ='visibility: hidden; display:none';
            document.getElementById("writer").style ='visibility: hidden; display:none';
        }
    } else {
      console.log("No such Document");
    }
}
if (localStorage.getItem("id")==null){
    document.getElementById("writer").style ='visibility: hidden; display:none';
    document.getElementById("signout").style ='visibility: hidden; display:none';
    // alert(`You are not logged in or you don't have permission to access to this document`)
    // window.location.href = "auth/Login/index.html";
} else {
    CheckId()
}

//Update view data
async function UpdateView() {
    var ref = doc(db, "Articles", localStorage.getItem("tvid"));  
    let new_view = parseInt(localStorage.getItem("view")) + 1
    console.log(new_view);
    await updateDoc(ref, {
        view: new_view
    })
    document.getElementById("content").innerHTML += `
    <h3 id="article_top_description" class="article_description">VIEW: ${new_view}</h3>
    `
}
