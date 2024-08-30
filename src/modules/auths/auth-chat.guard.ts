// import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { WsException } from '@nestjs/websockets';
// import { Observable } from 'rxjs';
// import { Socket } from 'socket.io';

import { CanActivate, ExecutionContext, Injectable, Logger } from "@nestjs/common";
import { Observable } from "rxjs";
import { Socket } from "socket.io";
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';

// @Injectable()
// export class AuthChatGuard implements CanActivate {
//   constructor(private readonly jwtService: JwtService) {}

//   canActivate(context: ExecutionContext): boolean {
//     console.log('AuthChatGuard.canActivate called');
//     const client = context.switchToWs().getClient<Socket>();
//     const token = client.handshake?.headers?.authorization?.split(' ')[1];

//     console.log('Token received:', token ? 'Yes' : 'No');

//     if (!token) {
//       console.error('No token provided in WebSocket connection');
//       throw new WsException('Bearer token not found');
//     }

//     try {
//       const secret = process.env.JWT_SECRET;
//       console.log('JWT Secret:', secret ? 'Set' : 'Not set');
//       const payload = this.jwtService.verify(token, { secret });

//       console.log('JWT Payload:', payload);

//       (client as any).user = {
//         userId: payload.sub,
//         isAdmin: payload.roles?.includes('admin'),
//         // Add other necessary user information
//       };

//       console.log('WebSocket authenticated:', (client as any).user);
//       return true;
//     } catch (error) {
//       console.error('WebSocket authentication failed:', error.message);
//       throw new WsException('Invalid token');
//     }
//   }
// }

//w ejemplo online
// @Injectable()
// export class WsJwtGuard implements CanActivate {

//   constructor(private readonly jwtService: JwtService){}

//   canActivate(context:ExecutionContext):boolean | Promise<boolean> | Observable<boolean>{
//     if(context.getType() !== 'ws') {
//       return true
//     }
    
//     const client:Socket = context.switchToWs().getClient();
//     const {authorization} = client.handshake.headers;
    
   

//     WsJwtGuard.validateToken(client);

//     return true
//   }

//   static validateToken(client:Socket) {
//     const {authorization} = client.handshake.headers;
//     Logger.log({authorization});
//     const token: string = authorization.split(' ')[1];
//     const payload = jwt.verify(token, process.env.JWT_SECRET);
//   }

// }


//w adaptado a mi codigo

@Injectable()
export class WsJwtGuard implements CanActivate {

  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    if (context.getType() !== 'ws') {
      return true;
    }
    
    const client: Socket = context.switchToWs().getClient();
    WsJwtGuard.validateAndAttachUser(client);

    return true;
  }

  static validateAndAttachUser(client: Socket) {
    const { authorization } = client.handshake.headers;
    Logger.log({ authorization }, 'Authorization header received');

    if (!authorization) {
      throw new Error('Authorization header is missing');
    }

    const token: string = authorization.split(' ')[1];

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET) as any;
      Logger.log({ payload }, 'Token payload');

      // Attach user information to the client object
      (client as any).user = {
        userId: payload.sub,
        isAdmin: payload.roles?.includes('admin'),
        // Add other necessary user information from the payload
      };

      Logger.log('User information attached to client:', (client as any).user);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}
