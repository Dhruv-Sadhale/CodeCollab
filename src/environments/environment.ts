 export const environment={
    
    production:false,
    firebaseConfig : {

    apiKey: process.env['FIRE_BASE_API_KEY'],
  
    authDomain: "olpnew.firebaseapp.com",
  
    projectId: "olpnew",
  
    storageBucket: "olpnew.appspot.com",
  
    messagingSenderId: "1068847586573",
  
    appId: "1:1068847586573:web:82fc2ad62bb8cc08172444",
  
    measurementId: "G-ESY6VJ58KX"
  
  },
  geminiApiKey: process.env['GEMINI_API_KEY']
};
  