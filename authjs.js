// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAHMHAHTCMnkxL_N2zLyA52QliQtk5jaqQ",
    authDomain: "budgetmonitor-68d6a.firebaseapp.com",
    projectId: "budgetmonitor-68d6a",
    storageBucket: "budgetmonitor-68d6a.appspot.com",
    messagingSenderId: "407945418401",
    appId: "1:407945418401:web:03595ae744328b452fc2e0",
    measurementId: "G-8D67WHMPXL"
};

const app = firebase.initializeApp(firebaseConfig);
// const db = firebase.firestore();
const auth = firebase.auth();

function getEP() {
    return [document.getElementById('email').value, document.getElementById('password').value];
}
document.getElementById('addUser').addEventListener('click', () => {
    let info = getEP();
    console.log(info)
    auth.createUserWithEmailAndPassword(info[0], info[1]).then((res) => {
        console.log(res, res.user);
    })
        .catch((err) => {
            // alert()
            console.log(err.messagingSenderId, err.code);
        })
})

document.getElementById('loginUser').addEventListener('click', () => {

    let info = getEP();

    auth.signInWithEmailAndPassword(info[0], info[1]).then((res) => {
        console.log(res, res.user.uid);
        localStorage.setItem('UID', res.user.uid)
        location.href='dashboard.html';
    })
        .catch((err) => {
            alert(err.messagingSenderId +" -> "+ err.code);
        })
})


// async function setData(){
//     let info = getEP();
//     let uid = localStorage.getItem('UID');
//     // console.log(uid);
//     let dbUsers = db.collection('users')
//     await getContent();
//     // console.log(getInfo);
//     let objArray = getInfo;
//     if (objArray === undefined) {
//         console.log("undefin", objArray);
//         objArray = { 'Data': [document.getElementById('content').value] }
//     }
//     else {
//         objArray['Data'].push(document.getElementById('content').value)
//     }
//     dbUsers.doc(uid).set(objArray).then((para) => {
//         // console.log(para)
//         // console.log(document.getElementById('content').value)
//     }).catch((err) => {
//         console.log(err)
//     })
// }

// let getInfo;
// document.getElementById('saveContent').addEventListener('click',setData);

// async function getContent() {
//     let uid = localStorage.getItem('UID');
//     // console.log(uid);
//     let dbUsers = await db.collection('users')
//     await dbUsers.doc(uid).get().then((para) => {
//         console.log(para.data(), 'DATA')
// getInfo=para.data();
//         // return para.data();
//     }).catch((err) => {
//         console.log(err)
//     })
// }

// document.getElementById('getConten').addEventListener('click', getContent)