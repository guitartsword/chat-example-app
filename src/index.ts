import express from 'express';
import bodyParser from "body-parser";

import { createSocketServer } from './webSocketServer';
import {  PORT } from './util/envVariables';
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

const server = app.listen(PORT, () => {
    console.log(`Connect to PORT ${PORT}`)
});

createSocketServer(server);
