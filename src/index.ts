import amqp from 'amqplib';
import express from 'express';
import bodyParser from "body-parser";
import WebSocket from "ws";
import jwt from 'jsonwebtoken'

import { wsServer, createSocketServer } from './webSocketServer';
import { RABBITMQ_QUEUE, RABBITMQ_URL, DEFAULT_CHANNEL, PORT } from './util/envVariables';
import authRoutes from './routes/auth';
import chatRoutes from './routes/chat';
import channelsRoutes from './routes/channels';

const app = express();

app.use(bodyParser.text());
app.use(bodyParser.json());
app.use(express.static('public'));

app.use('/', authRoutes);
app.use('/chat', chatRoutes);
app.use('/channels', channelsRoutes);

// app.get('/', (req, res) => res.send('Message Chat App'));

app.post('/sendMessage', async (req, res) => {
    const message = req.body;
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
