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
import {doc, collection, getDoc, getFirestore, query, orderBy, limit, onSnapshot} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js"; 
const db = getFirestore();

///////////////CHECK USER ID////////////////
async function CheckId() {
    var ref = doc(db, "User Info", localStorage.getItem("id"));
    const docSnap = await getDoc(ref);
  
    if (docSnap.exists()) { 
      let role = docSnap.data().role;
        
        if (role != "writer" && role != "reader") {
            alert(`You are not logged in or you don't have permission to access to this document`)
            window.location.href = "../auth/Login/index.html";
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
    alert(`You are not logged in or you don't have permission to access to this document`)
            window.location.href = "../auth/Login/index.html";
    document.getElementById("writer").style ='visibility: hidden; display:none';
    document.getElementById("signout").style ='visibility: hidden; display:none';
    // alert(`You are not logged in or you don't have permission to access to this document`)
    // window.location.href = "auth/Login/index.html";
} else {
    CheckId()
}


document.getElementById("signout").addEventListener("click", () => {
    localStorage.removeItem("id")
    localStorage.removeItem("mail")
    localStorage.removeItem("username")
})

const arref = collection(db, "Articles")
//////////////RECENT ARTICLE////////////////////
async function generate_recentData(){
    const q = query(arref, orderBy("id", "desc"), limit(50));
    let dataList = await onSnapshot(q, (snapshot) => {
        let data = []
        snapshot.docs.forEach((doc) => {
            data.push({...doc.data(), id: doc.id})
            let number = 0
            if (doc.data().category =='review'){
                document.getElementById("recent_article_container").innerHTML += `
                <a class="recent_article" href='../articles/article.html?id=${doc.id}'>
                    <img class="recent_article_img" src="${doc.data().thumbnail}" alt="">
                    <h3 class="recent_article_title">${doc.data().content[0].text}</h3>
                </a>
                `        
                number = number + 1     
            }
            if (number==1) {
                return
            } 
        });
    })
}
generate_recentData();
