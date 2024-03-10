const socket = io('https://smoothie-webserve-git.glitch.me/');
var tnum = 0;
var roomKey = "";
var id = "";
const myText = document.getElementById("myText");
const otherText = document.getElementById("otherText");
const textContainer = document.getElementById("textView");
myText.style.display = "none";
otherText.style.display = "none"
function login() {
  var verify = false
  var email = document.getElementById("email").value
  var password = document.getElementById("password").value
  if (email == null || email == "" || password == null || password == "") {
    document.getElementById("loginAlert").innerHTML = "*Please enter the username or password.";
    setInterval(function() {
      document.getElementById("loginAlert").innerHTML = "";
    }, 3000)
  }
  else {
    verify = true
    id = email
  }
  if (verify) {
    if (localStorage.getItem("ID") != null) {
      localStorage.setItem('ID', id);
    };
    if (localStorage.getItem("roomKey") != null) {
      roomKey = localStorage.getItem("roomKey");
      $("#keyInput").val(roomKey)
    };
    document.getElementById("hider").style.display = 'block';
    document.getElementById("loginForm").style.display = 'none';
  }
}
function roomKeySubmit(event) {
  event.preventDefault();
  roomKey = document.getElementById('keyInput').value;
  localStorage.setItem('roomKey', roomKey);
}
document.getElementById('keyForm').addEventListener('submit', roomKeySubmit);
function messageSubmit(event) {
  event.preventDefault();
  message = document.getElementById('messageimp').value;
  document.getElementById('messageimp').value = ""
  socket.emit('message', { roomKey: roomKey, message: message, id: id})
  message = id + ": " + message;
    var cloned = myText.cloneNode(true); 
    cloned.textContent = message;
    cloned.style.display = "block";
    textContainer.appendChild(cloned);
  textContainer.scrollTop = textContainer.scrollHeight;
}
document.getElementById('messageForm').addEventListener('submit', messageSubmit);
socket.on("chatUpdate", (data) => {
  var amessage = data.message;
  console.log(amessage)
  var key = data.id;
  var charKey = []
  var i = 0;
  while (i < key.length) {
    charKey[i] = key.charCodeAt(i);
    i++;
  }
  charKey.join("")
  key = charKey[0]
  var message =amessage.map(a => String.fromCharCode(a / key)).join('');
  message = data.id + ": " + message;
  if (data.roomKey == roomKey) {
    var cloned = otherText.cloneNode(true); 
    cloned.textContent = message;
    cloned.style.display = "block";
    textContainer.appendChild(cloned);
  }
});
const video = document.getElementById('videoElement');
const othervideo = document.getElementById('videoElement2');
function activateCamera() {
  navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
    const videoTrack = stream.getVideoTracks()[0];
    const imageCapture = new ImageCapture(videoTrack);
    imageCapture.grabFrame()
      .then(imageBitmap => {
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
