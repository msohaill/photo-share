import socketClient from 'socket.io-client';
import { env } from './env';

export default socketClient(env.server, { withCredentials: true });
