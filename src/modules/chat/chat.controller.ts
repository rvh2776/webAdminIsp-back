import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiForbiddenResponse, ApiOperation, ApiResponse, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { ChatService } from "./chat.service";
import { Roles } from "src/decorators/roles.decorator";
import { Role } from "../auths/roles.enum";
import { AuthGuard } from "../auths/auth.guards";
import { RolesGuard } from "../auths/roles.guard";

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
    constructor(
        private readonly chatService: ChatService,
    ){}

  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiOperation({ summary: 'Retorna array con ids de salas sin Admin asignado' })
  @ApiResponse({
    status: 201,
    description: 'Salas pendientes de atención ',
  })
    @ApiBearerAuth()
    @Roles(Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    @Get('pending-rooms')
    async getPendingRooms(){
        const rooms = await this.chatService.getRoomsWithoutAdmin();
        return rooms
    }
}