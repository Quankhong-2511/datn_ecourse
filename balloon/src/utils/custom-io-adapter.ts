import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';

export class CustomIoAdapter extends IoAdapter {
  createIOServer(port: number, options?: ServerOptions): any {
    const optionsWithCors = {
      ...options,
      cors: {
        origin: '*', // Hoặc chỉ định các nguồn cụ thể nếu cần
        methods: ['GET', 'POST'],
        credentials: true,
      },
    };
    return super.createIOServer(port, optionsWithCors);
  }
}
