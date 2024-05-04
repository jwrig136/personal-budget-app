// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import { initializeApp } from "firebase/app";
import { getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAMF3ivIKiMpaL07FPmrYxj_wsBX5E4caU",
  authDomain: "personalbudget-369c4.firebaseapp.com",
  projectId: "personalbudget-369c4",
  storageBucket: "personalbudget-369c4.appspot.com",
  messagingSenderId: "980272867295",
  appId: "1:980272867295:web:71e929aa791c720992466a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

Cypress.Commands.add('login', (email = 'testing@gmail.com', password = 'password123') => {
return signInWithEmailAndPassword(auth, email, password);
})