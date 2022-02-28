var admin = require("firebase-admin");

var serviceAccount = require("./service_key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const firestore = admin.firestore();
firestore.settings({
  host: "localhost:8080",
  ssl: false
})

const path = require("path");
const fs = require("fs");
const directoryPath = path.join(__dirname, "files");

fs.readdir(directoryPath, function(err, files) {
  if (err) {
    return console.log("Unable to scan directory: " + err);
  }

  files.forEach(function(file) {
    if(file == "users.json") {
    populateUsers(file)
    }
    if(file == "userMatch.json") {
      populateUsers(file)
    }
  });
});

function populateUserMatchSubcollection(file) {
  var lastDotIndex = file.lastIndexOf(".");
  var menu = require("./files/" + file);

  menu.forEach(function(obj) {
    firestore
      .collection("users")
      .doc(obj.itemId)
      .collection(file.substring(0, lastDotIndex))
      .doc(obj.subCollectionID)
      .set(obj)
      .then(function(docRef) {
        console.log("Subcollection written");
      })
      .catch(function(error) {
        console.error("Error adding document: ", error);
      });
  });
}


function populateUsers(file) {
  var lastDotIndex = file.lastIndexOf(".");  // 5
  var menu = require("./files/" + file);   // menu = All the items

  //file.substring(0, lastDotIndex) = users

  menu.forEach(function(obj) {
    firestore
      .collection(file.substring(0, lastDotIndex))
      .doc(obj.itemId)
      .set(obj)
      .then(function(docRef) {
        console.log("Document written");
      })
      .catch(function(error) {
        console.error("Error adding document: ", error);
      });
  });
}
