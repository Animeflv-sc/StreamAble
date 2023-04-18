import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-auth.js";
import { getDatabase, ref, set, update} from "https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-auth.js";



const firebaseConfig = {
    apiKey: "AIzaSyA_-0rmQRfbbBlD1V6v1MzXGnuLkt3VpR4",

    authDomain: "backup-and-restore-79f0c.firebaseapp.com",

    databaseURL: "https://backup-and-restore-79f0c-default-rtdb.firebaseio.com",

    projectId: "backup-and-restore-79f0c",

    storageBucket: "backup-and-restore-79f0c.appspot.com",

    messagingSenderId: "949892021523",

    appId: "1:949892021523:web:508b3381ff9561c96c6ee6",

    measurementId: "G-4XML440EY8"

};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const database = getDatabase(app);
let userRef;

const submitButton = document.getElementById("submit");
const signupButton = document.getElementById("sign-up");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const main = document.getElementById("main");
const createacct = document.getElementById("create-acct");

const signupEmailIn = document.getElementById("email-signup");
const confirmSignupEmailIn = document.getElementById("confirm-email-signup");
const signupPasswordIn = document.getElementById("password-signup");
const confirmSignUpPasswordIn = document.getElementById("confirm-password-signup");
const createacctbtn = document.getElementById("create-acct-btn");

const returnBtn = document.getElementById("return-btn");

var email, password, signupEmail, signupPassword, confirmSignupEmail, confirmSignUpPassword;

onAuthStateChanged(auth, (user) => {
  if (user) {
    const userId = user.uid;
    userRef = ref(database, `users/${userId}`);

    // Get the data from localStorage
    const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
    const bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
    const completedList = JSON.parse(localStorage.getItem("completedList")) || [];

    // Get the data from Firebase Realtime database
    get(userRef).then((snapshot) => {
      const data = snapshot.val();
      const firebaseWatchlist = data?.watchlist || [];
      
      // Check if the watchlist in the current device is greater than the watchlist in the Firebase Realtime database
      if (watchlist.length > firebaseWatchlist.length) {
        // If yes, update the watchlist, completedList, and bookmarks in the Firebase Realtime database
        set(userRef, {
          email: user.email,
          watchlist,
          bookmarks,
          completedList,
        }).then(() => {
          console.log("Data saved to Firebase Realtime Database.");
        }).catch((error) => {
          console.error("Error occurred while saving data to Firebase Realtime Database:", error);
        });
      }
    }).catch((error) => {
      console.error("Error occurred while getting data from Firebase Realtime Database:", error);
    });
  }
});



createacctbtn.addEventListener("click", function() {
  var isVerified = true;

  signupEmail = signupEmailIn.value;
  confirmSignupEmail = confirmSignupEmailIn.value;
  if(signupEmail != confirmSignupEmail) {
      window.alert("Email fields do not match. Try again.")
      isVerified = false;
  }

  signupPassword = signupPasswordIn.value;
  confirmSignUpPassword = confirmSignUpPasswordIn.value;
  if(signupPassword != confirmSignUpPassword) {
      window.alert("Password fields do not match. Try again.")
      isVerified = false;
  }
  
  if(signupEmail == null || confirmSignupEmail == null || signupPassword == null || confirmSignUpPassword == null) {
    window.alert("Please fill out all required fields.");
    isVerified = false;
  }
  
  if(isVerified) {
    createUserWithEmailAndPassword(auth, signupEmail, signupPassword)
      .then((userCredential) => {
        const user = userCredential.user;
        window.alert("Success! Account created.");
        window.location.href = "./login.html"; // redirect to homepage
      })
      .catch((error) => {
        console.error("Error occurred while creating user:", error);
        window.alert("Error occurred while creating user. Try again.");
      });
  }
});

submitButton.addEventListener("click", function() {
  email = emailInput.value;
  console.log(email);
  password = passwordInput.value;
  console.log(password);

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log("Success! Welcome back!");
      window.alert("Success! Welcome back!");
      window.location.href = "./settings.html"; // redirect to homepage
      
      // Update data in Firebase Realtime Database
      const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
      const bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
      const completedList = JSON.parse(localStorage.getItem("completedList")) || [];

      set(userRef, {
        email,
        watchlist,
        bookmarks,
        completedList,
      }).then(() => {
        console.log("Data updated in Firebase Realtime Database.");
      }).catch((error) => {
        console.error("Error occurred while updating data in Firebase Realtime Database:", error);
      });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("Error occurred. Try again.");
      window.alert("Error occurred. Try again.");
    });
});


signupButton.addEventListener("click", function() {
    main.style.display = "none";
    createacct.style.display = "block";
});

returnBtn.addEventListener("click", function() {
    main.style.display = "block";
    createacct.style.display = "none";
});

