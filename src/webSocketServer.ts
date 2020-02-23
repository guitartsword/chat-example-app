import url from 'url';
import { Server } from 'http'

import WebSocket, { Server as SocketServer } from 'ws';
import amqp from 'amqplib';
import jwt from 'jsonwebtoken';

import { JWT_SECRET, RABBITMQ_URL, RABBITMQ_QUEUE } from './util/envVariables';
import { UserToken } from './util/commonTypes';
import amqpChannel from './util/rabbitMQ';

interface CustomSocketServer extends SocketServer {
    clients: Set<any>
}

export const wsServer = new SocketServer({
    noServer: true
}) as CustomSocketServer;


interface CustomWS extends WebSocket {
    isAlive: boolean
    username: string
    channel: string
    isAuthenticated: boolean
}

export const createSocketServer = async (server: Server) => {
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
        ws.username = `Guest${Number(Math.random() * 100000000).toString().padStart(8, '0')}`;
        ws.isAlive = true;
        ws.on('pong', () => {
            ws.isAlive = true;
        });
        ws.on('authenticate', (token) => {
            try {
                const payload = jwt.verify(token, JWT_SECRET) as UserToken;
                ws.username = payload.username;
                ws.isAuthenticated = true;
                ws.channel = 'default';
            } catch {
                return
            }
        });
        ws.on('message', function (message) {
            const event = JSON.parse(message.toString());
            this.emit(event.type, event.payload);
        });
        ws.on('channel', (channel) => {
            ws.channel = channel;
        });
        // ws.on('chat', async (payload) => {
        //     if (!ws.isAuthenticated) {
        //         ws.send(JSON.stringify({
        //             type: 'error',
        //             message: 'Not Authenticated'
        //         }));
        //     }
        //     const message = JSON.stringify({
        //         message: payload.message,
        //         channel: payload.channel || 'default',
        //     });
        //     const conn = await amqp.connect(RABBITMQ_URL);
        //     const ch = await conn.createChannel();
        //     ch.assertQueue(RABBITMQ_QUEUE, { durable: false, });
        //     ch.sendToQueue(RABBITMQ_QUEUE, Buffer.from(message));
        // })
    });
    const ch = await amqpChannel();
    ch.consume(RABBITMQ_QUEUE, (msg) => {
        const {
            channel,
            message,
            timestamp,
            user
        } = JSON.parse(msg?.content.toString() || '{}');
        wsServer.clients.forEach(async (ws:CustomWS) => {
            if (ws.channel !== channel) {
                return;
            }
            ws.send(JSON.stringify({
                time: Date.now(),
                timestamp,
                user,
                message,
                channel
            }));
        });
    }, { noAck: true });

    const interval = setInterval(function ping() {
        wsServer.clients.forEach((ws: CustomWS) => {
            if (ws.isAlive === false) return ws.terminate();

            ws.isAlive = false;
            ws.ping(() => { });
        });
    }, 30000);
    wsServer.on('close', () => {
        clearInterval(interval);
    });
}