/* Written by Snehil Kumar */


//Firebase
let database;
let databaseRef;
let storage;
let storageRef;

let allUrls = [];
let totalPhotos = 0;
let nItemsPerPage = 8;

let noImage;




function setup(){
  const firebaseConfig = {
    apiKey: "AIzaSyDhGbS2Kptg1uYkmBcmqae-5NNltVQKKno",
    authDomain: "photo-gallery-b9db9.firebaseapp.com",
    projectId: "photo-gallery-b9db9",
    storageBucket: "photo-gallery-b9db9.appspot.com",
    messagingSenderId: "1000704217094",
    appId: "1:1000704217094:web:3b0f1015765f53d6f87387",
    databaseURL: "https://photo-gallery-b9db9-default-rtdb.asia-southeast1.firebasedatabase.app/"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  database = firebase.database();
  databaseRef = database.ref().child('userdata');

  storage = firebase.storage();
  storageRef = storage.ref().child('sketches');
}

setup();


function startShowImages(){
  databaseRef.once("value",
    (data) => {
      allUrls = [];
      let users = data.val();
      if(users != null){
        let ids = Object.keys(users);
        for(let i = 0; i < ids.length; i++){
          let id = ids[i];
          let obj = {
            "un": users[id]['userName'],
            "ut": users[id]['userText'],
            "up": users[id]['userPhotoURL'],
            "ucn": users[id]['userFileName'],
            "ui": id
          };
          allUrls[i] = obj;
        }
      }
      totalPhotos = allUrls.length;
      display();
    },
    (error) => {
      console.log(error);
    }
  );
}



function display(){
  let tenUrls = [];
  let columns = document.querySelectorAll(".col");

  for(let i = 0; i < 4; i++){
    columns[i].innerHTML = "";
  }

  //copy 10 urls from the big array
  for(let i=totalPhotos-1, j=0; i>=0 && i>totalPhotos-nItemsPerPage-1; i--, j++){
    tenUrls[j] = allUrls[i];
  }

  let highLimit = totalPhotos - 1;
  let lowLimit = totalPhotos - tenUrls.length;

  if(totalPhotos == 0){
    highLimit = 0;
    lowLimit = 0;
  }

  let totalPages = parseInt( totalPhotos % nItemsPerPage > 0 ?
    totalPhotos / nItemsPerPage + 1 :
    totalPhotos / nItemsPerPage );

  document.querySelector("#galleryTopDiv").innerHTML = "Showing " + tenUrls.length + " of " + totalPhotos +
  " images, from indices " + highLimit + " to " + lowLimit + ", page no " + 
  (totalPages - parseInt((totalPhotos - 1) / nItemsPerPage)) + " of " + totalPages + " (latest first)";

  for(let i = 0; i < tenUrls.length; i++){
    let friendName = tenUrls[i]['un'];
    let quote = tenUrls[i]['ut'];
    let url = tenUrls[i]['up'];
    let fn = tenUrls[i]["ucn"];
    let entryId = tenUrls[i]['ui'];

    let inDiv = document.createElement("div");
    inDiv.className = "inDiv";
    columns[i % 4].appendChild(inDiv);

    let whoDiv = document.createElement("div");
    whoDiv.className = "whoDiv";
    inDiv.appendChild(whoDiv);

    let nameP = document.createElement("p");
    nameP.innerHTML = friendName;
    nameP.className = "nameP";
    whoDiv.appendChild(nameP);

    let delBut = document.createElement("button");
    delBut.innerHTML = "🗑️";
    delBut.className = "delBut";
    whoDiv.appendChild(delBut);

    let quoteDiv = document.createElement("div");
    quoteDiv.className = "quoteDiv";
    inDiv.appendChild(quoteDiv);

    let quoteP = document.createElement("p");
    quoteP.innerHTML = quote;
    quoteDiv.appendChild(quoteP);

    let imgDiv = document.createElement("div");
    imgDiv.className = "imgDiv";
    inDiv.appendChild(imgDiv);

    let img = document.createElement("img");
    imgDiv.appendChild(img);
    if(url == "") {
      img.src = "Assets/noImage.jpg";
      img.alt = "There is no image URL";
      img.style.height = "2rem";
    }
    else {
      img.src = url;
      img.alt = "User uploaded image";
    }

    delBut.addEventListener("click", () => {
      inDiv.style.display = "none";
      if(fn != ""){
        storageRef.child(fn).delete()
        .then(() => {
          console.log("Image deleted successfully!");
        })
        .catch((error) => {
          console.log("Image Deletion Error!", error);
        });
      }
      databaseRef.child(entryId).remove()
      .then(() => {
        console.log("Removed user data!");
      })
      .catch((error) => {
        console.log("Userdata Removal Error!", error.message);
      });
    });
  }

  console.log("Shown " + tenUrls.length + " elements for this page");
}




function previousPage(){
  if(totalPhotos + nItemsPerPage - 1 < allUrls.length){
    totalPhotos = totalPhotos + nItemsPerPage;
    display();
  }
}



function nextPage(){
  if(totalPhotos - nItemsPerPage - 1 >= 0){
    totalPhotos = totalPhotos - nItemsPerPage;
    display();
  }
}