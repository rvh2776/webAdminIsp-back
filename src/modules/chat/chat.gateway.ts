  import { Logger, OnModuleInit, UseGuards } from "@nestjs/common";
  import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
  import { Server, Socket } from "socket.io";
  import { ChatService } from "./chat.service";
  import { CustomSocket } from "./typings/ISocket";
  import { SocketAuthMiddleware } from "src/middlewares/ws.middleware";
  import { TimeoutService } from "./timeout.service";
  import axios from 'axios';

  // decora la clase para manejar conexiones con el protocolo websocket 
  @WebSocketGateway({
    cors: {
      origin: '*'
    }
  })
  // @UseGuards(WsJwtGuard) > esto NO sirve en una app hibrida (http-websocket) > 
  // la autenticacion se produce en el ciclo AfterInit()-ver mas abajo
  export class ChatGateway implements OnGatewayInit, OnModuleInit, OnGatewayConnection {

    // inyecta una instancia del ws server. 'server' ES el websocket server.
    // provee metodos para conectar, desconectar, emitir eventos,broadcasting, manejar rooms, etc
    @WebSocketServer()
    public server: Server;

      // inyecta servicios como ya sabemos
      constructor(
        private readonly chatService: ChatService,
        private readonly timeoutService: TimeoutService,
      ) {}

    // almacena in memory los timeouts para cada conexion (esto se haria en db)
    private idleTimeouts: Map<string, NodeJS.Timeout> = new Map();
    private warningTimeouts: Map<string, NodeJS.Timeout> = new Map();

    // afterInit() > momento en que se inicializa el ws server pero antes de haber una conexion, o sea, Nestjs instancia esta clase pero nadie se conecta aun.
    // Aqui se lleva a cabo la autenticacion del usuario llamando a un middleware que a su vez llama al WsJwtGuard. Esta guard agrega el objeto user al payload.
    // Socket > representa conexion individual entre el server y 1 cliente especifico
    // metodos varios de conexion, desconexion, leave, join, etc.
    afterInit(client:Socket){
      client.use(SocketAuthMiddleware() as any);
      Logger.log('Aplicacion de Chat Cargada: desde ChatGateway')
    }

    // OnModuleInit > momento en que el ChatModule y todas sus dependencias (providers) estan inicializadas. Se ejecuta despues del AfterInit().
    // 'connection' es un built-in global event para todas las conexiones ws.
    async onModuleInit() {
      console.log('ChatGateway initialized');
      this.server.on('connection', async (client: Socket) => {
        console.log(`Client attempting to connect: ${client.id}`);
        console.log('Socket handshake:', client.handshake.auth.name);
        //w emite mensaje con salas pendientes tras crearse nueva sala
        await this.emitPendingRoomsToAdmins();
      });
    }

    //w funcion para emitir mensaje con salas pendientes de atencion
    //w para enviar solo a los admins via socket
  private async emitPendingRoomsToAdmins() {
    const pendingRooms = await this.chatService.getRoomsWithoutAdmin();
    
    // retorna todos los sockets conectados
    const sockets = await this.server.fetchSockets();
    
    // emite las salas pendientes solo a los admins
    for (const socket of sockets) {
      const customSocket = socket as any as CustomSocket;
      if (customSocket.user && customSocket.user.isAdmin) {
        customSocket.emit('pending-rooms', pendingRooms);
      }
    }
  }

    //W ###### HANDLE CONNECTION (INDIVIDUAL)###################
    // se ejecuta cuando un nuevo usuario se conecta
    // si el usuario no esta autenticado lo desconecta(esto ya lo hace el AfterInit
    async handleConnection(client: Socket) {
      console.log('Nuevo Usuario Conectado');
      const { userId, isAdmin } = (client as any).user;
      const { name } = client.handshake.auth;
      console.log('User object on socket:', (client as any).user);
      console.log(name);
    
      if (!userId) {
        console.log('User not authenticated, disconnecting');
        client.disconnect();
        return;
      }
    
      console.log('Usuario Autenticado con ID', userId);
    
      // establece los tiempos de advertencia y desconexion por inactividad
      await this.timeoutService.setupWarningTimeout(client);
      await this.timeoutService.setupIdleTimeout(client);

      // si se conecta un user (non-admin), se emite el mensaje con las salas
    if (!isAdmin) {
      await this.emitPendingRoomsToAdmins();
    }
    
      // 'escucha' cuando un usuario se desconecta(cierra el tab)
      client.on('disconnect', async () => {
        console.log(`Cliente ${name} se desconecto: ${client.id}`);
    
        // busvca la sala del desconectado y se fija si era user o admin
        const roomId = await this.chatService.findRoomByParticipant(userId);
        if (roomId) {
          const participants = await this.chatService.getRoomParticipants(roomId);
          if (participants) {
            if (participants.admin === userId) {
              console.log('Admin desconectado, notificando user y borrando sala...');
              this.server.to(roomId).emit('user-disconnected', 'El agente se ha desconectado - Chat Terminado');
              
              // desconecta al user, cierra el socket, y elimina sala
              const userSocket = Array.from(this.server.sockets.sockets.values())
                .find(socket => (socket as any).user.userId === participants.user);
              if (userSocket) userSocket.disconnect();
    
              await this.chatService.deleteRoom(roomId);
            } else if (participants.user === userId) {
              participants.user = null;
              console.log('Cliente desconectado y eliminado de diccionario');

              // emite evento 'user-disconnected' a todos los usuarios en la sala
              this.server.to(roomId)
              .emit('user-disconnected', `${name} se ha desconectado del chat`);

              if (!participants.admin) {
                await this.chatService.deleteRoom(roomId);
                console.log('Sala vacia: Sala ELIMINADA');
              }
            }
          }
        }
        // elimina los timeout asociados al usuario desconectado
        this.timeoutService.clearTimeouts(client.id);
      });
      // resetea los timeouts cada vez que un usuario manda un mensaje
      client.on('send-message', () => {
        this.timeoutService.resetTimeouts(client);
      });
    }

    
    // @SubscribeMessage 'escucha' evento 'create-room' emitido por cliente y dispara la funcion
    @SubscribeMessage('create-room')
    async handleCreateRoom(@ConnectedSocket() client: CustomSocket) {
     try {
       //extrae userId del usuario autenticado
       const { userId, isAdmin } = client.user;
       if(isAdmin) {
         client.emit('join-failed', 'Los admins no pueden crear salas');
         client.disconnect();
         return
       }
 
       // evita que el usuario pueda crear mas de 1 sala
       const existingRoom = await this.chatService.findRoomByParticipant(userId);
       if (existingRoom) {
         client.emit('join-failed', 'Ya tienes un chat abierto. No puedes crear otra sala.');
         return;
       }
 
       // crea una nueva room y retorna el roomId
       const response = await this.chatService.createRoom(userId);
       //agrega el cliente al room creado
       client.join(response.roomId);
       //emite evento 'room-created' informando al cliente de nueva room y su union a ella > el cliente debe estar subscrito a este evento para escucharlo
       client.emit('room-created', response);

        //w emite mensaje con salas pendientes tras crearse nueva sala
      await this.emitPendingRoomsToAdmins();
      console.log(`>>>>Enviando salas pendientes a admins >>>>`)
 
    //    // busca las rooms sin admins asignados
    //    const newRoomIDs = await this.chatService.getRoomsWithoutAdmin();
    //    console.log('>>> ROOMIDs sin admin para enviar a Nextjs server>>>',newRoomIDs)
    //    // envia las rooms al front - endpoint de Nextjs
    //    const nextResponse = await axios.post('https://frontend-swart-sigma.vercel.app/api/rooms', { roomIDs: newRoomIDs },  { 
    //     headers: { 
    //       authorization: 'a5c0febe-c609-476f-a661-b538f19b2177' 
    //  }});

    //  console.log('>>> ENVIO DE ROOMS EXITOSO>>>',nextResponse);
 
       return response
     } catch (error) {
      console.error('Error in handleCreateRoom:', error);
      client.emit('join-failed', 'Error al crear sala');
     }
    }

    // escucha evento 'join-room' del usuario (user o admin), ejecuta funcion.
    //recibe roomId y socket client
    @SubscribeMessage('join-room')
    async handleJoinRoom(
      @MessageBody() roomId: string,
      @ConnectedSocket() client: CustomSocket
    ) {
      // extrae userId y si es o no Admin
      const { userId, isAdmin } = client.user;
      console.log(`Admin status for user ${userId}:`, isAdmin);
      // registra al usuario al diccionario/db/room, retorna true/false
      const joined = await this.chatService.joinRoom(roomId, userId, isAdmin);
      
      // si el registro es exitoso, se lo agrega al room(literalmente)
      if (joined) {
        //.join(<roomId>) agrupa al 1 cliente a este room particular
        client.join(roomId);
        //client == Socket > retorna roomId al cliente (que debe escuchar este evento)
        client.emit('room-joined', {success:'Usuario se unio a la sala',roomId});
        // notifica a TODOS los usuarios en ESA room, que alguien se conecto
        this.server.to(roomId).emit('user-joined', { success:'Usuario(Admin) se unio al chat', userId, isAdmin });

        return joined
      } else {
        // emite evento para join-failed
        client.emit('join-failed', 'Unable to join room');
      }
    }

    // escucha evento 'send-message', recibe data del room+mensaje y el usuario emisor
    @SubscribeMessage('send-message')
    async handleMessage(
      @MessageBody() data: { roomId: string; message: string },
      @ConnectedSocket() client: CustomSocket
    ) {
      // desestructura la info entrante
      const { userId, isAdmin } = client.user;
      const { name } = client.handshake.auth;
      const { roomId, message } = data;

      //retorna lista de usuarios en el room
      const participants = await this.chatService.getRoomParticipants(roomId);
      // verifica si el emisor es el user o admin asignados y re-emite el mensaje a todo el room 
      // esto se usa para renderizar el mansaje en la view del chat.
      if (participants && (participants.user === userId || participants.admin === userId)) {
        this.server.to(roomId).emit('new-message', {
          userId,
          name,
          roomId,
          isAdmin,
          message,
        });
        console.log('new-message:', {
          userId,
          name,
          roomId,
          isAdmin,
          message,
        })
      }
    }
  }