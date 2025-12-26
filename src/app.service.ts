import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  /**
   *
   */
  getHello(): string {
    return 'Surprisingly! You have accessed Liem Lan Cms BE!';
  }
}
