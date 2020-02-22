const ws = new WebSocket('ws://localhost:3030/chat');
ws.onmessage = (socket) => {
    console.log(socket);
    const msg = JSON.parse(socket.data);
    const messageDiv = document.createElement('div');
    const messageParagraph = document.createElement('p');
    messageDiv.append(messageParagraph);
    messageParagraph.innerText = `${msg.user} [${msg.channel}]: ${msg.message}`
    document.querySelector('#chat').append(messageDiv);
};
ws.onclose = () => alert('Lost connection, please Refresh');

function sendMessage() {
    const messageInput = document.querySelector('#message');
    const text = messageInput.value;
    var requestOptions = {
        method: 'POST',
        body: text,
        redirect: 'follow'
      };
      
    fetch("http://localhost:3030/sendMessage", requestOptions);
}