let ws = new WebSocket(`ws://${location.host}/chat`);
setWSEvents(ws);
let reconnectInterval;
let authToken = '';
function setWSEvents(ws) {
    ws.onopen = () => {
        clearInterval(reconnectInterval);
        wsLogin(ws, authToken);
    }
    ws.onmessage = (socket) => {
        console.log(socket);
        const msg = JSON.parse(socket.data);
        const messageDiv = document.createElement('div');
        const messageParagraph = document.createElement('p');
        messageDiv.append(messageParagraph);
        messageParagraph.innerText = `${msg.user} [${msg.channel}]: ${msg.message}`
        document.querySelector('#chat').append(messageDiv);
    };
    ws.onclose = () => {
        alert('Connection close, please refresh');
    };
}


function sendMessage() {
    const messageInput = document.querySelector('#message');
    const text = messageInput.value;
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

    fetch(`http://${location.host}/chat`, requestOptions);
}

function wsLogin(ws, token) {
    ws.send(JSON.stringify({
        type: 'authenticate',
        payload: token
    }));
}

function handleLogin() {
    const loginSection = document.querySelector('#login-section');
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

    fetch(`http://${location.host}/login`, requestOptions).then((res) => res.json()).then(({ error, token }) => {
        if (error) {
            alert(error)
        }
        if (token) {
            wsLogin(ws, token);
            authToken = token;
            usernameInput.value = '';
            passwordInput.value = '';
            loginSection.style.display = 'none';
        }
    });
}

function handleRegister() {
    const loginSection = document.querySelector('#login-section');
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

    fetch(`http://${location.host}/register`, requestOptions).then((res) => res.json()).then(({ created, username }) => {
        if (!created) {
            alert('ERROR: User creation failed')
            return
        }
        usernameInput.value = '';
        passwordInput.value = '';
    });
}

function getLastMessages() {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    fetch(`http://${location.host}/chat`).then((res) => res.json()).then(({ created, username }) => {
        if (!created) {
            alert('ERROR: User creation failed')
            return
        }
        usernameInput.value = '';
        passwordInput.value = '';
    });
}