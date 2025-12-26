import { Module } from '@nestjs/common';
import { BaseUserController } from './base-user.controller';

@Module({
  controllers: [BaseUserController],
})
export class BaseUserModule {}
