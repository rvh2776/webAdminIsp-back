import { Socket } from 'socket.io';

export interface CustomSocket extends Socket {
  user: {
    userId: string;
    isAdmin: boolean;
  };
}