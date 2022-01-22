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



//Viet bai`
let idText= 2

document.getElementById("add_text").addEventListener("click", add_text)
function add_text(){
    document.getElementById("content").innerHTML +=`
    <div class="text_container">
      <label for="text">Add Text</label>
      <input name="text" id="${idText}" type="text" placeholder="Text" class="input_text">
    </div>
    `
    idText=idText+1
}

document.getElementById("add_image").addEventListener("click", add_image)
function add_image(){
    document.getElementById("content").innerHTML +=`
    <div class="image_container">
        <label for="image">Add Image</label>
        <input name="image" id="${idText}" type="text" placeholder="Image link" class="input_image">
    </div>
    `
    idText=idText+1
}

document.getElementById("add_description").addEventListener("click", add_description)
function add_description(){
    document.getElementById("content").innerHTML +=`
    <div class="description_container">
        <label for="description">Add Description</label>
        <input name="description" id="${idText}" class="input_description" type="text" placeholder="Description">
    </div>
    `
    idText=idText+1
}

//Submit va lay thong tin
document.getElementById("submit").addEventListener("click", submit)
function submit(){
    let category = document.getElementById(`category`).value
    let curStatus = document.getElementById(`status`).value
    let thumbnail = document.getElementById(`thumbnail`).value
    let content = []
    for(var i=1; i<20; i++){
        var contentCheck = document.getElementById(`${i}`);
        if(contentCheck){
            let part = {
                type: document.getElementById(`${i}`).className, 
                text: document.getElementById(`${i}`).value, 
                }; 
            content.push(part)       
        }
    }
    // let article = {
    //     content: content,
    //     category: category,
    //     status: curStatus
    // }
    var id=Date.now()
    localStorage.setItem("id", id);
    localStorage.setItem("curStatus", curStatus);
    localStorage.setItem("category", category);
    localStorage.setItem("thumbnail", thumbnail);
    localStorage.setItem("content", JSON.stringify(content));
    console.log(id);
    AddArticle_AutoID()
}



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
import {doc, setDoc, collection, addDoc, getDoc, getFirestore, query, orderBy, limit, onSnapshot} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js"; 
const db = getFirestore();

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
            document.getElementById("signup").style ='visibility: hidden; display:none';
        } else {
            alert(`You don't have permission to access to this document`)
            window.location.href = "../index.html";
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


//add article information 
async function AddArticle_AutoID() {
    var ref = collection(db, "Articles");
  
    const docRef = await addDoc(ref, {
        content: JSON.parse(localStorage.getItem("content")),
        category: localStorage.getItem("category"),
        status: localStorage.getItem("curStatus"),
        id: localStorage.getItem("id"),
        thumbnail: localStorage.getItem("thumbnail"),
        view: 0
    })
      .then(() => {
        alert("Article added successfully");
        location.reload();
      })
      .catch((error) => {
        alert("Unsuccessuful operation, error: " + error);
      });
  }


// async function AddArticle_customID() {
//   await setDoc(doc(db, "Articles", localStorage.getItem("id")), {
//     content: JSON.parse(localStorage.getItem("content")),
//     category: localStorage.getItem("category"),
//     status: localStorage.getItem("curStatus"),
//   });
// }

//get article information
async function GetADocument() {
    var ref = doc(db, "Articles", '1642696882037');
    const docSnap = await getDoc(ref);
  
    if (docSnap.exists()) {
      let content = docSnap.data().content;
      let category = docSnap.data().category;
      let curStatus = docSnap.data().status;
      console.log(content, category, curStatus);
    } else {
      alert("No such Document");
    }
}

const arref = collection(db, "Articles")
const q = query(arref, orderBy("id", "desc"), limit(3));
onSnapshot(q, (snapshot) => {
    let data = []
    snapshot.docs.forEach((doc) => {
        data.push({...doc.data(), id: doc.id})
    });
    console.log(data)
})