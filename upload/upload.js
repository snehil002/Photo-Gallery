/* Written by Snehil Kumar */

//Firebase
let database;
let databaseRef;
let storage;
let storageRef;

let nameTextInput = document.querySelector("#textInputForName");
let quoteTextInput = document.querySelector("#textInputForQuote");
let selectedPhotoDiv = document.querySelector('#selectedPhotoDiv');
let fileInput = document.querySelector('#fileInput');
let uploadProgressbar = document.querySelector("#uploadProgressBar");
let submitButton = document.querySelector("#submitButton");


function setup() {
  submitButton.addEventListener("click", uploadCanvas);

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

  fileInput.addEventListener(
    "change",
    (event) => {
      let selectedFile = event.target.files[0];
      selectedPhotoDiv.innerHTML = "";

      if(selectedFile) {
        let selectedImage = document.createElement('img');
        selectedImage.src = URL.createObjectURL(selectedFile);

        selectedPhotoDiv.appendChild(selectedImage);
      }
      else{
        selectedPhotoDiv.innerHTML = "No Image Selected";
      }
    },
    false
  );
}


setup();



function uploadCanvas() {
  let uName = "", uText = "";
  let uPhotoURL = "", uFileName = "";
  let uFiles = null, uFile = null;
  let obj = null;
  let resDiv = document.querySelector("#resDiv");

  //Taking input
  uName = nameTextInput.value.trim();
  uText = quoteTextInput.value.trim();
  uFiles = fileInput.files;

  if (uFiles.length == 1) {
    uFile = uFiles[0];
  }

  if(uName == "" || uText == "" || uFile == null) {
    resDiv.className = "marginTop16px";
    resDiv.innerHTML = "Something's wrong! 😭";
    return;
  }

  if (uFile instanceof File) {
    resDiv.className = "marginTop16px";
    resDiv.innerHTML = "Starting Upload...";

    //Generating file name
    uFileName = randomNumber();
    
    if(uFile.type == "image/png"){
      uFileName += ".png";
    }
    else if(uFile.type == "image/jpeg"){
      uFileName += ".jpeg";
    }

    let metadata = {
      contentType: uFile.type
    };

    let uploadTask = storageRef.child(uFileName).put(uFile, metadata);
    
    uploadTask.on(
      "state_changed",
      getSnap,
      errorCall,
      successCall
    );

    function getSnap(snapshot) {
      let progress = parseInt((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      uploadProgressbar.style.display = "block";
      uploadProgressbar.value = progress;
      resDiv.innerHTML = snapshot.state + ": " + progress + "%";
    }

    function errorCall(error) {
      resDiv.innerHTML = "Error Uploading! 🥺";
      console.log("Upload error!", error);
    }

    function successCall() {
      (async function(){
        uPhotoURL = await uploadTask.snapshot.ref.getDownloadURL();
        obj = {
          'userName': uName,
          'userText': uText,
          'userFileName': uFileName,
          'userPhotoURL': uPhotoURL
        };
        databaseRef.push(obj);
        resDiv.innerHTML = "Success!!! ✅";
        setTimeout(() => {
          window.location.replace("../index.html");
        }, 1000);
      })();
    }
  }
}




function randomNumber(){
  return parseInt(100000 + Math.random() * (999999 - 100000));
}