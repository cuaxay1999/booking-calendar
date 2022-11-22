import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// App
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Entity
import { UserEntity } from './modules/users/user.entity';
import { Appoiments } from './modules/appoinments/appoinment.entity';

// Module
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/users/user.module';
import { AppoinmentModule } from './modules/appoinments/appoinment.module';

// config
// import config from 'src/config/app.config';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [UserEntity, Appoiments],
      synchronize: true,
      autoLoadEntities: true,
    }),

    UserModule,
    AuthModule,
    AppoinmentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
