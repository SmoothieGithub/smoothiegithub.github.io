$("#send_button").click(function() {
    var message = $("#message_input").val();
    $("#message_input").val("");
    
    $("#messages").append(
      "<div class='message_container_sent'>" +
      "<p class='message_p_sent'>" +
      "..." +
      "</p>" +
      "</div>"
    );
    
    
    const options = {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        message: message,
      })
    };
    fetch("https://smoothie2prod.glitch.me/send", options)
      .then(response => {
        console.log(response);
      })
  });
  
  
  
  
  const eventSource = new EventSource('https://smoothie2prod.glitch.me/events');
eventSource.onmessage = (event) => {
  const messages = JSON.parse(event.data);

  const messageList = document.querySelector('#messages_container');
  messageList.innerHTML = ''; // Clear current messages

  // Display all messages
  messages.forEach((message) => {
    const li = document.createElement('li');
    li.textContent = message;
    messageList.appendChild(li);
  });
};
