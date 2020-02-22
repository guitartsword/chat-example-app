import url from 'url';
import { Server } from 'http'

import amqp from 'amqplib';
import express from 'express';
import bodyParser from "body-parser";
import WebSocket from "ws";

import { wsServer } from './websocket';

const PORT = process.env.PORT || 3000;
const DEFAULT_CHANNEL = 'general';
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost'
const RABBITMQ_QUEUE = process.env.RABBITMQ_QUEUE || 'chat_app'
const app = express();

app.use(bodyParser.text());
app.use(bodyParser.json());
app.use(express.static('public'));


app.get('/', (req, res) => res.send('Message Chat App'));

app.post('/sendMessage', async (req, res) => {
    const message = req.body;
    const conn = await amqp.connect(RABBITMQ_URL);
    const ch = await conn.createChannel();
    ch.assertQueue('chat_app', { durable: false, });
    ch.sendToQueue('chat_app', Buffer.from(message));
    res.send(`${message}\n\nsent to: ${DEFAULT_CHANNEL}`)
});

app.post('/sendMessage/:channel', (req, res) => {
    const message = req.body;
    res.send(`${message}\n\nsent to: ${req.params.channel}`)
})

app.get('/getMessages', async (req, res) => {
    const channel = 'general';
    
});

app.get('/getMessages/:channel', async (req, res) => {
    const channel = req.params.channel || 'general';
    const conn = await amqp.connect(RABBITMQ_URL);
    const ch = await conn.createChannel();
    ch.assertQueue('chat_app', { durable: false, });
    ch.consume('chat_app', (msg) => {
        res.send(msg?.content)
    }, {noAck: true});
});

const server = app.listen(PORT, () => {
    console.log(`Connect to PORT ${PORT}`)
});
createSocketServer(server);


interface CustomWS extends WebSocket {
    isAlive: boolean
    username: string
    channel: string
}

async function createSocketServer(server: Server) {
    let channel = 'general', user = 'Guest'
    server.on('upgrade', (request, socket, head) => {
        const pathname = url.parse(request.url).pathname;
        if (pathname?.includes('/chat')) {
            channel = pathname.split('/')[2] || channel
            wsServer.handleUpgrade(request, socket, head, (ws) => {
                wsServer.emit('connection', ws, request)
            });
            
        }
    });
    wsServer.on('connection', (ws: CustomWS) => {
        user = `Guest${Number(Math.random()*100000000).toString().padStart(8, '0')}`;
        ws.isAlive = true;
        ws.on('pong', () => {
            ws.isAlive = true;
        });
        ws.once('message', (username) => {
            user = username;
        })
        ws.on('message', (message) => {
            console.log(message);
        });
    });
    const conn = await amqp.connect(RABBITMQ_URL);
    const ch = await conn.createChannel();
    ch.assertQueue('chat_app', { durable: false, });
    ch.consume('chat_app', (msg) => {
        const message=msg?.content.toString();
        wsServer.clients.forEach(async (ws) => {
            ws.send(JSON.stringify({
                time: Date.now(),
                user,
                message,
                channel
            }));
        });
    }, {noAck: true});
    
    const interval = setInterval(function ping() {
        wsServer.clients.forEach((ws: CustomWS) => {
          if (ws.isAlive === false) return ws.terminate();
      
          ws.isAlive = false;
          ws.ping(() => {});
        });
      }, 30000);
    wsServer.on('close', () => {
        clearInterval(interval);
    });
}
