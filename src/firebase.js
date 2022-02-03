import { initializeApp } from 'firebase/app';
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    authDomain: "khaw-ming-sheng-cv.firebaseapp.com",
    projectId: "khaw-ming-sheng-cv",
    storageBucket: "khaw-ming-sheng-cv.appspot.com",
  };

  const firebaseApp = initializeApp(firebaseConfig);
  const storage = getStorage(firebaseApp);
  

export default storage;
