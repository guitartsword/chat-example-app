/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
/* eslint-disable no-use-before-define */
const baseUrl = `${window.location.protocol}//${window.location.host}`;
let wsUrl = `${window.location.host}/chat`;
if (window.location.protocol === 'https:') {
  wsUrl = `wss://${wsUrl}`;
} else {
  wsUrl = `ws://${wsUrl}`;
}
const ws = new WebSocket(wsUrl);
let reconnectInterval;
let authToken = '';
let channel = '';

// DOM updates
function appendMessage(msg) {
  const messageDiv = document.createElement('div');
  const messageParagraph = document.createElement('p');
  messageDiv.append(messageParagraph);
  messageParagraph.innerText = `${msg.user} [${msg.channel}]: ${msg.message}`;
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
  if (!text) {
    return;
  }
  const requestOptions = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: text,
    }),
    redirect: 'follow',
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
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      password,
    }),
    redirect: 'follow',
  };

  fetch(`${baseUrl}/login`, requestOptions).then((res) => res.json()).then(({ error, token }) => {
    if (error) {
      alert(error);
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
  event.preventDefault();
  const usernameInput = document.querySelector('#username');
  const passwordInput = document.querySelector('#password');
  const { value: username } = usernameInput;
  const { value: password } = passwordInput;
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      password,
    }),
    redirect: 'follow',
  };

  fetch(`${baseUrl}/register`, requestOptions).then((res) => res.json()).then(({ created }) => {
    if (!created) {
      alert('ERROR: User creation failed');
      return;
    }
    alert('User created!');
    usernameInput.value = '';
    passwordInput.value = '';
  });
}

function getLastMessages(newChannel = '') {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow',
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  };

  fetch(`${baseUrl}/chat/${newChannel}`, requestOptions).then((res) => res.json()).then(({ messages, error }) => {
    if (error) {
      console.log('ERROR: fetching');
      return;
    }
    messages.reverse().forEach((msg) => {
      appendMessage(msg);
    });
  });
}

// Web Sockets
function setWSEvents(webSocket) {
  webSocket.onopen = () => {
    clearInterval(reconnectInterval);
    wsLogin(webSocket, authToken);
  };
  webSocket.onmessage = (socket) => {
    const msg = JSON.parse(socket.data);
    appendMessage(msg);
  };
  webSocket.onclose = () => {
    alert('Connection close, please refresh');
  };
}
function wsLogin(webSocket, token) {
  webSocket.send(JSON.stringify({
    type: 'authenticate',
    payload: token,
  }));
}

function changeChannel(newChannel) {
  channel = newChannel;
  ws.send(JSON.stringify({
    type: 'channel',
    payload: newChannel,
  }));
  clearMessage();
  getLastMessages(newChannel);
}

// Call Initial Functions
setWSEvents(ws);
