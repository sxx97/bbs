import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import dayjs from 'dayjs';
import crypto from 'crypto';

@WebSocketGateway(8888, {
  namespace: 'xunfei',
  cors: {
    origin: '*',
  },
})
export class EventsXunfeiSocket
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    console.log('Initialized!');
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log('client connected');
    this.initXunfei('spark-api.xf-yun.com', new Date());
  }

  handleDisconnect(client: Socket) {
    console.log('client disconnected');
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, text: string): void {
    client.emit('msgToClient', text);
  }

  initXunfei(
    host: string,
    date: Date,
    APIKey = '3a71de5715db8afa59df17708c2b6875',
    APISecret = 'MDZjNTJiZjA5NmFjNWJhZDk0MDMwYjI5',
  ) {
    const dateStr = dayjs(date, 'ddd, DD MMM YYYY HH:mm:ss GMT');
    const tmp = `host: ${host}
		date: ${dateStr}
		GET/v2.1/chat HTTP/1.1												
		`;

    const hmac = crypto.createHmac('sha256', APISecret);
    hmac.update(tmp);
    const signature = hmac.digest('base64');

    // 构造authorization origin字符串
    const algorithm = 'hmac-sha256';
    const headers = 'host date request-line';
    const authorizationOrigin = `api_key='${APIKey}', algorithm='${algorithm}', headers='${headers}', signature='${signature}'`;
    const authorization = crypto
      .createHash('sha256')
      .update(authorizationOrigin)
      .digest('base64');
    return `wss://${host}/v2.1/chat?authorization=${encodeURIComponent(
      authorization,
    )}&date=${encodeURIComponent(dateStr.toString())}&host=${encodeURIComponent(
      host,
    )}`;
  }
}
