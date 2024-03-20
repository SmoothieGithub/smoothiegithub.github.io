//socket.emit("joinRoom", ({roomKey: roomKey, socketID: socket.id}))
const socket = io('https://smoothie-webserve-git.glitch.me/');
var tnum = 0;
var roomKey = "";
var id = "";
var slid = true
const myText = document.getElementById("myText");
const otherText = document.getElementById("otherText");
const myName = document.getElementById("myName")
const otherName = document.getElementById("otherName")
const textContainer = document.getElementById("textView");
const createAccount = document.getElementById("createAccountForm")
const loginAccount = document.getElementById("loginAccountForm")
const arrow = document.getElementsByClassName('arrow');

myText.style.display = "none";
otherText.style.display = "none"
var logOrCre = "log";
socket.on("connect", () => {
  //console.log(socket.id)
  socket.emit("joinRoom", ({ roomKey: roomKey, socketID: socket.id }))
})
socket.on("testPing", (data) => {
  console.log(data);
})
//Login
function toggleForm() {
  if (logOrCre == "cre") {
    document.getElementById("createAccountForm").style.display = 'none';
    document.getElementById("loginAccountForm").style.display = "block";
    logOrCre = "log";
  }
  else {
    document.getElementById("createAccountForm").style.display = 'block';
    document.getElementById("loginAccountForm").style.display = "none";
    logOrCre = "cre";
  }
}

function login() {
  var email = document.getElementById("email").value
  var password = document.getElementById("password").value

  if (email == null || email == "" || password == null || password == "") {
    document.getElementById("loginAlert").innerHTML = "*Please enter the username or password.";
    setTimeout(function() {
      document.getElementById("loginAlert").innerHTML = "";
    }, 3000)
  } else {
    socket.emit("loginAttempt", { username: email, password: password })
  }
}
socket.on("loginResponse", (data) => {
  if (data.res == true) {
    id = document.getElementById("email").value
    console.log("sucessfully logged in")
    if (localStorage.getItem("ID") != null) {
      localStorage.setItem('ID', id);
    };
    if (localStorage.getItem("roomKey") != null) {
      roomKey = localStorage.getItem("roomKey");
      $("#keyInput").val(roomKey)
    };
    document.getElementById("hider").style.display = 'block';
    document.getElementById("logOrCreForms").style.display = 'none';
    socket.emit("joinRoom", ({ roomKey: roomKey, socketID: socket.id }))
    document.getElementById("groupName").innerHTML = roomKey
  } else {
    document.getElementById("loginAlert").innerHTML = "*incorrect username or password.";
    setTimeout(function() {
      document.getElementById("loginAlert").innerHTML = "";
    }, 3000)
  }
}
)
function newAcc() {
  console.log("new account")
  var username = document.getElementById("newUsername").value
  var email = document.getElementById("newEmail").value
  var password = document.getElementById("newPassword").value
  if (username == null || username == "" || password == null || password == "" || email == null || email == "") {
    document.getElementById("loginAlert").innerHTML = "*Please enter a new username or password.";
    setTimeout(function() {
      document.getElementById("loginAlert").innerHTML = "";
    }, 3000)
  } else {

    console.log("createAttempt sent")
    socket.emit("createAttempt", { username: username, password: password, email: email, })
  }
}
socket.on("createResponse", (data) => {
  if (data.res == true) {
    location.reload();
    id = document.getElementById("newUsername").value
    console.log("sucessfully created new account and logged in!")
    if (localStorage.getItem("ID") != null) {
      localStorage.setItem('ID', id);
    };
    if (localStorage.getItem("roomKey") != null) {
      roomKey = localStorage.getItem("roomKey");
      $("#keyInput").val(roomKey)
    };
    document.getElementById("hider").style.display = 'block';
    document.getElementById("logOrCreForms").style.display = 'none';
    document.getElementById("groupName").innerHTML = roomKey
  } else {
    document.getElementById("loginAlert").innerHTML = "*username is unavailable.";
    setTimeout(function() {
      document.getElementById("loginAlert").innerHTML = "";
    }, 3000)
  }
})
//Text
function clearMessages() {
  textContainer.innerHTML = "";
}
function roomKeySubmit(event) {
  event.preventDefault();
  roomKey = document.getElementById('keyInput').value;
  localStorage.setItem('roomKey', roomKey);
  clearMessages();
  socket.emit("joinRoom", ({ roomKey: roomKey, socketID: socket.id }))
  slideIn();
  slid = true;
}
document.getElementById('keyForm').addEventListener('submit', roomKeySubmit);
function messageSubmit(event) {
  event.preventDefault();
  message = document.getElementById('messageimp').value;
  document.getElementById('messageimp').value = "";
  socket.emit('message', { roomKey: roomKey, message: message, id: id });
  //displaying Name
  var clonedName = myName.cloneNode(true);
  clonedName.textContent = id;
  clonedName.style.display = "block";
  textContainer.appendChild(clonedName);
  //------viewing the message------
  var clonedMessage = myText.cloneNode(true);
  clonedMessage.textContent = message;
  clonedMessage.style.display = "block";
  textContainer.appendChild(clonedMessage);
  textContainer.scrollTop = textContainer.scrollHeight;

}
document.getElementById('messageForm').addEventListener('submit', messageSubmit);


//SOCKET CHAT UPDATE THING FROM SOCKET
socket.on("chatUpdate", (data) => {
  //console.log("update!" + data.message)
  var amessage = data.message;
  //otherdi = data.id;
  var key = data.id;
  var charKey = []
  var i = 0;
  while (i < key.length) {
    charKey[i] = key.charCodeAt(i);
    i++;
  }
  charKey.join("")
  key = charKey[0]
  var message = amessage.map(a => String.fromCharCode(a / key)).join('');
  message = data.id + ": " + message;
  if (data.roomKey == roomKey) {
    var cloned = otherText.cloneNode(true);
    cloned.textContent = message;
    cloned.style.display = "block";
    textContainer.appendChild(cloned);
    textContainer.scrollTop = textContainer.scrollHeight;
  }
});

//VIDEO
const video = document.getElementById('videoElement');

function activateCamera() {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      video.srcObject = stream;

      const videoTrack = stream.getVideoTracks()[0];
      const imageCapture = new ImageCapture(videoTrack);
      // Capture a frame (you can capture frames continuously as needed)
      imageCapture.grabFrame()
        .then(imageBitmap => {
          // Convert the imageBitmap to base64 data
          const canvas = document.createElement('canvas');
          canvas.width = imageBitmap.width;
          canvas.height = imageBitmap.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(imageBitmap, 0, 0);
          const base64Data = canvas.toDataURL('image/jpeg');
          socket.emit('camera', base64Data);
        })
        .catch(error => {
          console.error('Error capturing frame:', error);
        });
    })
    .catch(error => {
      console.error('Error accessing the camera:', error);
    });

}
function deactivateCamera() {
  video.srcObject = null;
}
function slideOut() {
  ;
  document.getElementById("textChat").style.animation = "slideout 1s forwards";
}
function slideIn() {
  document.getElementById("textChat").style.animation = "slidein 1s forwards";
}
document.querySelector(".arrow").addEventListener('click', function() {
  if (slid == true) {
    slideOut();
    slid = false;
  }
  else {
    slideIn(); slid = true
  }
});
