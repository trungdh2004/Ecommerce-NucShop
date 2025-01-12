import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyDcj3YQ0eYrJY_cKeYDCZ-l5eBo72XwEks",
	authDomain: "shopapp-72e6d.firebaseapp.com",
	projectId: "shopapp-72e6d",
	storageBucket: "shopapp-72e6d.appspot.com",
	messagingSenderId: "572111016250",
	appId: "1:572111016250:web:95a613f8c78cfcf043c003",
	measurementId: "G-4EPSZVZM5S",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;
