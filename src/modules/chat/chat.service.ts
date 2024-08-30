import { Injectable } from "@nestjs/common";
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ChatService {
  // 'rooms' es un dicccionario > esto se haria en base de datos en realidad
  //la key es el roomId y su valor un objeto con ids the user y admin
  /*
 {
  'room1': {
    user: 'user123',
    admin: 'admin456'
  },
  'room2': {
    user: 'user789',
    admin: 'admin012'
  },
   */
  private rooms: Record<string, { user: string; admin: string }> = {};

  // crea un chatRoom solicitado por cliente y lo asocia a el
  async createRoom(userId: string) {
    //genera id unico para el chatRoom
    const roomId = this.generateRoomId();
    // crea nuevo registro del room en el diccionario
    this.rooms[roomId] = { user: userId, admin: null };
    console.log(`#### >> Nueva Sala con ID: ${roomId} en diccionario`)
    console.log(`#### >> Usuario agregado a la sala en diccionario: ${userId}`)
    console.log(this.rooms)
    return {
      success: 'Sala Creada y Usuario agregado a sala',
      roomId:roomId
    }
  }

  // agrega usuario al diccionario/db/room
  async joinRoom(roomId: string, userId: string, isAdmin: boolean): Promise<boolean> {
    console.log(`Admin status for user ${userId}:`, isAdmin);
    console.log('Existing Rooms:', this.rooms);
    // verifica si room existe
    if (!this.rooms[roomId]) {
      console.log('LA SALA NO EXISTE');
      console.log('Existing Rooms:', this.rooms);
      return false;
    } 

    const room = this.rooms[roomId];

    // verifica si la sala ya esta llena
  if (room.admin && room.user) {
    console.log('SALA LLENA: solo 1 user y 1 admin por sala');
    console.log('Existing Rooms:', this.rooms);
    return false;
  }
    
    // si usuario es admin y NO esta aun agregado al room, se lo agrega
    if (isAdmin && !room.admin) {
      //solo puede haber un admin por room
      room.admin = userId;
      console.log('Admin agregado a sala en diccionario')
      console.log('Existing Rooms:', this.rooms);
      return true;
    } 

    
    // If the user is not an admin and the room has no user, assign them
  if (!isAdmin && !room.user) {
    room.user = userId;
    console.log('User added to room');
    console.log('Existing Rooms:', this.rooms);
    return true;
  }

  // si ninguna conficion se cumple, no puede unirse a la sala
  console.log('USER NO PUEDE UNIRSE A LA SALA');
  console.log('Existing Rooms:', this.rooms);

    return false;
  }

  async findRoomByParticipant(userId: string): Promise<string | null> {
    for (const roomId in this.rooms) {
      if (this.rooms[roomId].user === userId || this.rooms[roomId].admin === userId) {
        return roomId;
      }
    }
    return null;
  }

  // busca sala by admin
//   async findRoomByAdmin(adminId: string): Promise<string | null> {
//     for (const roomId in this.rooms) {
//         if (this.rooms[roomId].admin === adminId) {
//             return roomId;
//         }
//     }
//     return null;
// }

  // elimina una sala
  async deleteRoom(roomId: string): Promise<void> {
    delete this.rooms[roomId];
    console.log(`Sala ${roomId} eliminada del diccionario`);
  }

  // retorna lista de participantes del room indicado
 async  getRoomParticipants(roomId: string): Promise<{ user: string; admin: string } | null> {
    return this.rooms[roomId] || null;
  }

  // retorna array de roomIDs que no tienen un admin
  async getRoomsWithoutAdmin(){
    return Object.entries(this.rooms)
      .filter(([_, participants]) => !participants.admin)
      .map(([roomId, _]) => roomId);
  }

  // genera id unico para room
  private generateRoomId(): string {
    return uuidv4();
  }
}