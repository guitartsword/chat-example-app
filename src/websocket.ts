import WebSocket, { Server as SocketServer } from 'ws';

interface CustomSocketServer extends SocketServer {
    clients: Set<any>
}

export const wsServer = new SocketServer({
    noServer: true
}) as CustomSocketServer;