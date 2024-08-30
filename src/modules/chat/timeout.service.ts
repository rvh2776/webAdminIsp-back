import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
import { ChatService } from "./chat.service";

@Injectable()
export class TimeoutService {
  private idleTimeouts: Map<string, NodeJS.Timeout> = new Map();
  private warningTimeouts: Map<string, NodeJS.Timeout> = new Map();

  constructor(private readonly chatService: ChatService) {}

  //w sacarle el cero extra
  // timeout por inactividad
  private readonly WARNING_TIMEOUT= 240000; // 4 minutos : advertencia
  private readonly IDLE_TIMEOUT = 300000; // 5 minutos: desconecta

  async setupWarningTimeout(client: Socket) {
    // limpia timouts existentes para evitar que se vea duplicado
    if (this.warningTimeouts.has(client.id)) {
        clearTimeout(this.warningTimeouts.get(client.id));
        this.warningTimeouts.delete(client.id);
      }

    const warningTimeout = setTimeout(() => {
      client.emit('inactivity-warning', '¿Aún estás ahi? Escribe algo para mantener la conexión');
      console.log(`Client ${client.id} warned about inactivity`);
    }, this.WARNING_TIMEOUT);

    this.warningTimeouts.set(client.id, warningTimeout);
  }

  async setupIdleTimeout(client: Socket) {
    // limpia timouts existentes para evitar que se vea duplicado
    if (this.idleTimeouts.has(client.id)) {
        clearTimeout(this.idleTimeouts.get(client.id));
        this.idleTimeouts.delete(client.id);
      }

    const idleTimeout = setTimeout(async () => {
        client.emit('idle-timeout', 'El chat fue desconectado por inactividad');
      client.disconnect(true);
      console.log(`Cliente ${client.id} desconectado por inactividad`);

      // obtiene el roomId y elimina la sala
      const roomId = this.getRoomId(client);
      if (roomId) {
        await this.chatService.deleteRoom(roomId);
        console.log(`Room ${roomId} deleted due to inactivity`);
      }
    }, this.IDLE_TIMEOUT);

    this.idleTimeouts.set(client.id, idleTimeout);
  }

  resetTimeouts(client: Socket) {
    this.clearTimeouts(client.id);
    this.setupWarningTimeout(client);
    this.setupIdleTimeout(client);
  }

  clearTimeouts(clientId: string) {
    const warningTimeout = this.warningTimeouts.get(clientId);
    const idleTimeout = this.idleTimeouts.get(clientId);

    if (warningTimeout) {
      clearTimeout(warningTimeout);
      this.warningTimeouts.delete(clientId);
    }

    if (idleTimeout) {
      clearTimeout(idleTimeout);
      this.idleTimeouts.delete(clientId);
    }
  }

  private getRoomId(client: Socket): string | null {
    const rooms = Array.from(client.rooms);
    const roomId = rooms.find((room) => room !== client.id);
    return roomId || null;
  }
}
