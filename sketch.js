/*Powered by SNEHIL KUMAR*/


//Firebase
let database;
let databaseRef;
let storage;
let storageRef;

let allUrls = [];
let p = 0;
let nItemsPerPage = 8;

let uploadProgressbar;
let noImage;




function setup(){
  noCanvas();
  uploadProgressbar = document.querySelector("#uploadProgressBar");

  let submitButton = selectAll('#submitButton')[0];
  submitButton.mouseClicked(uploadCanvas);

  let prevBut = createButton("⬅");
  prevBut.mouseClicked(previousPage);
  prevBut.parent('galleryButtonsDivBottom');
  prevBut.class("pageButtons");

  let refreshBut = createButton("🔁");
  refreshBut.mouseClicked(startShowImages);
  refreshBut.parent('galleryButtonsDivTop');
  refreshBut.class("pageButtons");

  let nextBut = createButton("➡");
  nextBut.mouseClicked(nextPage);
  nextBut.parent('galleryButtonsDivBottom');
  nextBut.class("pageButtons");

  selectAll("#galleryTopDiv")[0].html("Images will be shown below : upload and 🔁 to show");
  
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
  databaseRef = database.ref().child('folder');

  storage = firebase.storage();
  storageRef = storage.ref().child('sketches');


  let fileInput = document.querySelector('#fileInput');
  fileInput.addEventListener(
    "change",
    (event) => {
      let selectedFiles = event.target.files;
      let selectedFile = selectedFiles[0];
      
      console.log(selectedFile);
      console.log(event.target.value);

      let selectedPhotoDiv = document.querySelector('#selectedPhotoDiv');
        
      // while(selectedPhotoDiv.firstChild){
      //   selectedPhotoDiv.removeChild(selectedPhotoDiv.firstChild);
      // }
      selectedPhotoDiv.innerHTML='';

      let selectedImage = document.createElement('img');
      selectedImage.src = URL.createObjectURL(selectedFile);
      
      selectedPhotoDiv.appendChild(selectedImage);
    },
    false
  );
//    startShowImages();
}




function startShowImages(){
  databaseRef.once("value",
    (data)=>{
      allUrls = [];
      let users = data.val();
      if(users!=null){
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
      p = allUrls.length-1;
      display();
    },
    (error)=>{
      console.log(error);
    }
  );
}



function display(){
  let tenUrls = [];
  let columns = selectAll(".col");

  //remove all 10 images
  let inDivs = selectAll('#galleryDiv .inDiv');
  let inDivsLen = inDivs.length;
  for(let i = 0; i < inDivsLen; i++){
    inDivs[i].remove();
  }
  console.log("Removed all " + inDivsLen + " page elements");

  //copy 10 urls from the big array
  for(let i=p,j=0; i>=0 && i>p-nItemsPerPage; i--,j++){
    tenUrls[j] = allUrls[i];
  }

  let highLimit = (p+1);
  let lowLimit = (p-tenUrls.length+2);

  if(allUrls.length == 0){
    highLimit = 0;
    lowLimit = 0;
  }

  let totalPages = int(allUrls.length%nItemsPerPage > 0 ?
    allUrls.length/nItemsPerPage+1 : allUrls.length/nItemsPerPage);

  selectAll("#galleryTopDiv")[0].html("Showing " + tenUrls.length + " of " + allUrls.length +
  " elements, from " + highLimit + " to " + lowLimit + " indices, page no " + (totalPages - int(p/nItemsPerPage)) +
  " of " + totalPages + " (latest first)");

  for(let i = 0; i<tenUrls.length; i++){
    let friendName = tenUrls[i]['un'];
    let quote = tenUrls[i]['ut'];
    let url = tenUrls[i]['up'];
    let fn = tenUrls[i]["ucn"];
    let entryId = tenUrls[i]['ui'];

    let inDiv = createDiv();
    inDiv.class('inDiv');
    inDiv.parent(columns[i%4]);

    let whoDiv = createDiv();
    whoDiv.parent(inDiv);
    whoDiv.class("whoDiv");

    if(friendName == ""){friendName = "";}
    let nameP = createP(friendName);
    nameP.class("nameP");
    nameP.parent(whoDiv);

    let delBut = createButton('🗑️');
    delBut.class('delBut');
    delBut.parent(whoDiv);

    let quoteDiv = createDiv();
    quoteDiv.class("quoteDiv");
    quoteDiv.parent(inDiv);

    if(quote == ""){quote = "";}
    let quoteP = createP(quote);
    quoteP.parent(quoteDiv);

    let imgDiv = createDiv();
    imgDiv.class("imgDiv");
    imgDiv.parent(inDiv);

    let img = createElement('img');
    img.parent(imgDiv);
    if(url == ""){
      img.elt.src = "Assets/noImage.jpg";
      img.elt.alt = "There is no image URL";
    }else{
      img.elt.src = url;
      img.elt.alt = "User uploaded image";
    }

    delBut.mouseClicked(() => {
      inDiv.style("background-color", "#ddd");
      nameP.html(""); quoteP.html("");
      img.elt.src = "Assets/noImage.jpg";
      img.elt.alt = "There is no image URL";
      if(fn != ""){
        storageRef.child(fn).delete()
        .then(()=>{
          console.log("Image deleted successfully");
        })
        .catch((error)=>{
          console.log("Image not deleted ERROR" + error);
        });
      }
      databaseRef.child(entryId).remove()
      .then(()=>{
        console.log("Removed");
      })
      .catch((error)=>{
        console.log("Remove error " + error.message);
      });
    });
  }

  console.log("Shown " + tenUrls.length + " elements for this page");
}




function previousPage(){
  if(p+nItemsPerPage < allUrls.length){
    p = p + nItemsPerPage;
    display();
  }
}



function nextPage(){
  if(p-nItemsPerPage >= 0){
    p = p - nItemsPerPage;
    display();
  }
}



function randomNumber(){
  return int(random(100000, 999999));
}




function uploadCanvas(){
    let uName = "";
    let uText = "";
    let uPhotoURL = "";
    let uFileName = "";
    let uFiles = null;
    let uFile = null;
    let obj = null;
    let resDiv = document.querySelector("#resDiv");

    //Taking input
    uName = selectAll("#textInputForName")[0].value();
    uText = selectAll("#textInputForQuote")[0].value();
    uFiles = selectAll("#fileInput")[0].elt.files;
    if(uFiles.length == 1){
      uFile = uFiles[0];
    }


    if((uName != "" || uText != "") || uFile != null){
      console.log("Posting");
      
      if(uFile instanceof File){
        resDiv.className = " marginTop16px";
        resDiv.innerHTML = "Starting Upload...";

        //Generating file name
        uFileName = randomNumber();
        let metadata;
        if(uFile.type == "image/png"){
          uFileName += ".png";
          metadata = {
            contentType: 'image/png'
          };
        }else if(uFile.type == "image/jpeg"){
          uFileName += ".jpeg";
          metadata = {
            contentType: 'image/jpeg'
          };
        }

        let flowerRef = storageRef.child(uFileName);

        let uploadTask = flowerRef.put(uFile, metadata);
        console.log(flowerRef.fullPath);

        uploadTask.on(
          "state_changed",
          getSnap,
          errorCall,
          successCall
        );

        function getSnap(snapshot) {
          let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          uploadProgressbar.value = progress;
          console.log(snapshot.state);
        }

        function errorCall(error) {
          console.log("Upload error" + error);
        }

        function successCall() {
          console.log("Upload success");
          getDUrl();
          async function getDUrl(){
            let resUrl = await uploadTask.snapshot.ref.getDownloadURL();
            // .then((url) => {
            uPhotoURL = resUrl;
            console.log("uPhotoURL is = " + uPhotoURL);
            // });
            obj = {
              'userName': uName,
              'userText': uText,
              'userPhotoURL': uPhotoURL,
              'userFileName': uFileName
            };
            console.log(uFileName);
            let resulting = databaseRef.push(obj);
            console.log(resulting);
            resDiv.innerHTML = "Success!!!";
          }
        }
      }
      else{
        obj = {
          'userName': uName,
          'userText': uText,
          'userPhotoURL': uPhotoURL,
          'userFileName': uFileName
        }
        console.log(uFileName);
        let resulting = databaseRef.push(obj);
        console.log(resulting);
        resDiv.innerHTML = "Success!!!";
      }
    }else{
      resDiv.className = "marginTop16px";
      resDiv.innerHTML = "Write something please!";
      console.log("Write something please");
    }
}
