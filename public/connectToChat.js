let ws = new WebSocket(`ws://${location.host}/chat`);
setWSEvents(ws);
let reconnectInterval;
let authToken = '';
let channel = '';
//Web Sockets
const baseUrl = `${location.protocol}//${location.host}`
function setWSEvents(ws) {
    ws.onopen = () => {
        clearInterval(reconnectInterval);
        wsLogin(ws, authToken);
    }
    ws.onmessage = (socket) => {
        const msg = JSON.parse(socket.data);
        appendMessage(msg);
    };
    ws.onclose = () => {
        alert('Connection close, please refresh');
    };
}
function wsLogin(ws, token) {
    ws.send(JSON.stringify({
        type: 'authenticate',
        payload: token
    }));
}

function changeChannel(newChannel) {
    channel = newChannel
    ws.send(JSON.stringify({
        type: 'channel',
        payload: newChannel,
    }));
    clearMessage();
    getLastMessages(newChannel);
}

// DOM updates
function appendMessage(msg) {
    const messageDiv = document.createElement('div');
    const messageParagraph = document.createElement('p');
    messageDiv.append(messageParagraph);
    messageParagraph.innerText = `${msg.user} [${msg.channel}]: ${msg.message}`
    document.querySelector('#chat').append(messageDiv);
}

function clearMessage() {
    document.querySelector('#chat').innerHTML = '';
}

// HTTP calls
function sendMessage() {
    event.preventDefault();
    const messageInput = document.querySelector('#message');
    const text = messageInput.value;
    if(!text) {
        return;
    }
    var requestOptions = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: text,
        }),
        redirect: 'follow'
    };

    fetch(`${baseUrl}/chat/${channel}`, requestOptions).then(() => {
        messageInput.value = '';
    });
}

function handleLogin() {
    event.preventDefault();
    const loginSection = document.querySelector('#login-section');
    const chatSection = document.querySelector('#chat-section');
    const usernameInput = document.querySelector('#username');
    const passwordInput = document.querySelector('#password');
    const { value: username } = usernameInput;
    const { value: password } = passwordInput;
    var requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            password
        }),
        redirect: 'follow'
    };

    fetch(`${baseUrl}/login`, requestOptions).then((res) => res.json()).then(({ error, token }) => {
        if (error) {
            alert(error)
        }
        if (token) {
            authToken = token;
            wsLogin(ws, token);
            getLastMessages();
            usernameInput.value = '';
            passwordInput.value = '';
            loginSection.style.display = 'none';
            chatSection.style.display = '';
        }
    });
}

function handleRegister() {
    event.preventDefault()
    const usernameInput = document.querySelector('#username');
    const passwordInput = document.querySelector('#password');
    const { value: username } = usernameInput;
    const { value: password } = passwordInput;
    var requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            password
        }),
        redirect: 'follow'
    };

    fetch(`${baseUrl}/register`, requestOptions).then((res) => res.json()).then(({ created, username }) => {
        if (!created) {
            alert('ERROR: User creation failed')
            return
        }
        usernameInput.value = '';
        passwordInput.value = '';
    });
}

function getLastMessages(channel = '') {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow',
        headers: {
            'Authorization': `Bearer ${authToken}`,
        }
    };

    fetch(`${baseUrl}/chat/${channel}`, requestOptions).then((res) => res.json()).then(({ messages, error }) => {
        if (error) {
            console.log('ERROR: fetching');
            return
        }
        messages.reverse().forEach((msg) => {
            appendMessage(msg)
        })
    });
}