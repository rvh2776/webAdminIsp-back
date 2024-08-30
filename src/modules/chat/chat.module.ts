import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { WsJwtGuard } from '../auths/auth-chat.guard';
import { TimeoutService } from './timeout.service';
import { ChatController } from './chat.controller';

@Module({
  imports: [],
  controllers:[ChatController],
  providers: [ChatGateway, ChatService, WsJwtGuard, TimeoutService],
})
export class ChatModule {}
