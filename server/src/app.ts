import express from 'express';

import { createServer } from 'http';
import { Server } from 'socket.io';

import cors from 'cors';
import loggerMiddleware from './middlewares/logger.middleware';
import bodyParser from 'body-parser';

import imageController from './modules/images/images.controller';
import env from './env';
import { imageHandler } from './lib/socket.io';
import errorHandlerMiddleware from './middlewares/error-handler.middleware';

const app = express();

app.use(cors({ credentials: true, origin: true }));
app.use(bodyParser.json({ limit: '16mb' }));
app.use(loggerMiddleware);

const http = createServer(app);
const io = new Server(http, { cors: { origin: true, credentials: true } });

app.use('/api/images', imageController);

http.listen(env.port, () => {
  console.log(`🌲 Server is running at https://localhost:${env.port}`);
});

io.on('connection', (socket) => {
  console.log('New client connectesd');
  socket.emit('connection', null);

  imageHandler(io, socket);

  socket.on('disconnect', () => console.log('User disconnected.'));
});

app.use(errorHandlerMiddleware);
