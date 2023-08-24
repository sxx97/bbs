import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import dayjs from 'dayjs';
import crypto from 'crypto';
import { Logger } from '@nestjs/common';

@WebSocketGateway(8888, {
  namespace: 'xunfei',
  path: '/socket',
  transports: ['websocket', 'polling'],
  cors: {
    origin: '*',
  },
  allowRequest: (req, callback) => {
    console.log('请求查看', req);
    setTimeout(() => {
      callback(null, true);
    }, 5000);
  },
})
export class XunfeiSocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger: Logger = new Logger('EventsXunfeiSocket');

  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    this.logger.log(`afterInit: ${server}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`, args);
    //    this.initXunfei('spark-api.xf-yun.com', new Date());
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ): void {
    this.logger.log(`data: ${data}, message: ${client.id}`);
    client.send(JSON.stringify({ event: 'tmp', data: '测试' }));
  }

  initXunfei(
    host: string,
    date: Date,
    APIKey = '3a71de5715db8afa59df17708c2b6875',
    APISecret = 'MDZjNTJiZjA5NmFjNWJhZDk0MDMwYjI5',
  ) {
    const dateStr = dayjs(date).format('ddd, DD MMM YYYY HH:mm:ss GMT');
    const tmp = `host: ${host}
date: ${dateStr}
GET /v2.1/chat HTTP/1.1`;

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
