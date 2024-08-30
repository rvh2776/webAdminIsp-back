import { Socket } from "socket.io"
import { WsJwtGuard } from "src/modules/auths/auth-chat.guard";

export type SocketIOMiddleware = {
    (client:Socket, next: (err?:Error)=> void);
};

export const SocketAuthMiddleware = (): SocketIOMiddleware => {
    return (client, next) =>{
        try{
            WsJwtGuard.validateAndAttachUser(client);
            next();
        } catch(error){
      console.error('Authentication error for socket:', error.message);

      // Pass the error to the next function, which can handle it
      next(new Error('Authentication failed. Please check your token.'));
        }
    }
}