import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
// implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
export class CommentGateway {
  @WebSocketServer() server: Server;

  afterInit(server: Server) {
    console.log('Initialized');
  }

  notifyNewComment(comment: any) {
    console.log('Emitting new comment:', comment);
    this.server.emit('newComment', comment);
  }
}
