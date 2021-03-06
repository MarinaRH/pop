
    
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDWCh11qHdv0FB0K6Y485VGJv2NKqIBqNw",
    authDomain: "cinefilia-72cb6.firebaseapp.com",
    databaseURL: "https://cinefilia-72cb6.firebaseio.com",
    projectId: "cinefilia-72cb6",
    storageBucket: "cinefilia-72cb6.appspot.com",
    messagingSenderId: "109673178421"
  };

    firebase.initializeApp(config);
   
  $(document).ready(function() {
    var passwordLogin = $('.password-login');
    var emailLogin = $('.email-login');
    var emailRegister = $('.email-register');
    var passwordRegisterNew = $('.password-register');
    var nameRegisterNew = $('.name-register');
    var validatePassword = false;
    var validateEmail = false;
    var validateName = false;
    
    emailRegister.on('keyup', function(event) {
      var EMAILUSER = /^[a-zA-Z0-9\._-]+@[a-zA-Z0-9-]{2,}[.][a-zA-Z]{2,3}$/;
  
      if (EMAILUSER.test($(this).val())) {
        validateEmail = true;
        validateRegister();
      } else {
        inactiveRegister();
      }
    });
  
  
    passwordRegisterNew.on('keyup', function(event) {
      if (passwordRegisterNew.val()) {
        validatePassword = true;
        validateRegister();
      } else {
        inactiveRegister();
      }
    });
  
    nameRegisterNew.on('keyup', function(event) {
      if (nameRegisterNew.val()) {
        validateName = true;
        validateRegister();
      } else {
        inactiveRegister();
      }
    });
  
    emailLogin.on('keyup', function(event) {
      var EMAILUSER = /^[a-zA-Z0-9\._-]+@[a-zA-Z0-9-]{2,}[.][a-zA-Z]{2,3}$/;
  
      if (EMAILUSER.test($(this).val())) {
        validateEmail = true;
        validateUser();
      } else {
        inactiveUser();
      }
    });
  
    passwordLogin.on('keyup', function(event) {
      if (passwordLogin.val()) {
        validatePassword = true;
        validateUser();
      } else {
        inactiveUser();
      }
    });
  
    function validateUser() {
      if (validateEmail && validatePassword) {
        $('.btn-login').attr('disabled', false);
      }
    }
  
  
    function validateRegister() {
      if (validateEmail && validatePassword && validateName) {
        $('.btn-register').attr('disabled', false);
      }
    }
  
    function inactiveRegister() {
      $('.btn-register').attr('disabled', 'disabled');
    }
  
    function inactiveUser() {
      $('.btn-login').attr('disabled', 'disabled');
    }
    
    
    $('.btn-register').click(function() {
      firebase.auth().createUserWithEmailAndPassword(emailRegister.val(), passwordRegisterNew.val())
        .catch(function(error) {
          var errorCode = error.code;
          var errorMessage = error.message;
        });
  
      firebase.auth().onAuthStateChanged(function(user) {
        var userNew = nameRegisterNew.val();    
        if (user) {
          // Ingresando datos en la base de datos
          firebase.database().ref('users/' + user.uid).set({
            name: userNew,
            email: user.email,
            uid: user.uid,
            // profilePhoto: 'https://firebasestorage.googleapis.com/v0/b/our-kids-47772.appspot.com/o/userdefault.png?alt=media&token=ff44fe35-e341-45e5-914c-05878f0d72dd',
            // posterPhoto: 'https://firebasestorage.googleapis.com/v0/b/our-kids-47772.appspot.com/o/portada.png?alt=media&token=bbdfc01f-73ee-40b5-b1ca-91347557e0bb'
          }).then(user => {
            console.log('Usuario Registrado');
          });
        } else {
          console.log('Error al registrar');
        }
      });
    });
  
    // Autentificación por email y password
    
    $('.btn-login').click(function(event) {
      event.preventDefault();
  
      var email = emailLogin.val();
      var password = passwordLogin.val();
  
      firebase.auth().signInWithEmailAndPassword(email, password)
        .catch(function(error) {
          // Handle Errors here.
          alert('email y/o contraseña incorrecta');
          var errorCode = error.code;
          var errorMessage = error.message;
        });
  
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          $(location).attr('href', 'home/index.html');
        }
      });
    });
  
  
    // Login con Google
    // var provider = new firebase.auth.GoogleAuthProvider();
    // $('.btn-google').on('click', function() {
    //   event.preventDefault();
    //   firebase.auth().signInWithPopup(provider).then(function(result) {
    //     var token = result.credential.accessToken;
  
    //     var user = result.user;
  
    //     firebase.database().ref('users/' + user.uid).set({
    //       name: user.displayName,
    //       email: user.email,
    //       uid: user.uid,
    //       profilePhoto: user.photoURL,
    //       posterPhoto: 'NONE'
    //     }).then(
    //       user => {
    //         $(location).attr('href', '../home/index.html');
    //       });
    //   }).catch(function(error) {
      // Handle Errors here.
        // var errorCode = error.code;
        // var errorMessage = error.message;
        // The email of the user's account used.
        // var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        // var credential = error.credential;
      // ...
    //   });
    // });
  



    function observer() {
        firebase.auth().onAuthStateChanged(function(user) {
          var $photoProfile = $('#photoProfile');
          var $nameUsers = $('#nameUsers');
          var $usersComent = $('.usersComent');
          var $comentsPhoto = $('.comentsPhoto');
  
  
        if (user) {
          console.log('usuario activo');
          var displayName = user.displayName;
          localStorage.displayName = user.displayName;
          var email = user.email;
          console.log(email);
          var emailVerified = user.emailVerified;
          var photoURL = user.photoURL;
          console.log(photoURL);
  
          localStorage.photoURL = user.photoURL;
          var isAnonymous = user.isAnonymous;
          var uid = user.uid;
          var providerData = user.providerData;
  
          $photoProfile.attr('src', photoURL);
          $comentsPhoto.attr('src', photoURL);
          $nameUsers.text(displayName);
          $usersComent.text(displayName);
  
        } else {
          console.log('no existe usuario activo');
        }
      });
    }
    observer();
  
    var user = null;
    var usuariosConectados = null;
    var database = firebase.database();
    var conectadoKey = '';
    var $btnGoogle = $('.btn-google');
  
    $btnGoogle.on('click', logInGoogle);
  
    function logInGoogle() {
      event.preventDefault();
  
      var provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider).then(function(result) {
        user = result.user;
        console.log(user);
  
        observer();
        initApp();
  
        window.location.href = '../home/index.html';
      });
    }
  
  
    function initApp() {
      usuariosConectados = database.ref('/connected');
      login(user.uid, user.displayName || user.email);
    }
  
    function login(uid, name) {
      var conectado = usuariosConectados.push({
        uid: uid,
        name: name
      });
      conectadoKey = conectado.key;
      console.log(conectadoKey);
    }
    // var providerFacebook = new firebase.auth.FacebookAuthProvider();
    // $('.btn-facebook').on('click', function() {
    //   event.preventDefault();
    //   firebase.auth().signInWithPopup(providerFacebook).then(function(result) {
    //     var token = result.credential.accessToken;
  
    //     var user = result.user;
  
    //     firebase.database().ref('users/' + user.uid).set({
    //       name: user.displayName,
    //       email: user.email,
    //       uid: user.uid,
    //       profilePhoto: user.photoURL,
    //       posterPhoto: 'NONE'
    //     }).then(
    //       user => {
    //         $(location).attr('href', '../home/index.html');
    //       });
    //   }).catch(function(error) {
    //   // Handle Errors here.
    //     var errorCode = error.code;
    //     var errorMessage = error.message;
    //     // The email of the user's account used.
    //     var email = error.email;
    //     // The firebase.auth.AuthCredential type that was used.
    //     var credential = error.credential;
    //   // ...
    //   });
    // });
  
  
    $('.close').click(function() {
      firebase.auth().signOut().then(function() {
        $(location).attr('href', '../login.html');
      }).catch(function(error) {
      // An error happened.
  
      });
    });
  });