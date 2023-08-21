import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as ormConfig from '../ormconfig.json';
import { AuthModule } from './modules/auth/auth.module';
import { CategoryModule } from './modules/postCategory/category.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...(ormConfig as TypeOrmModuleOptions),
    }),
    AuthModule,
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
