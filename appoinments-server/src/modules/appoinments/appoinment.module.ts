import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppoimentService } from './appoinment.service';

import { AppoimentController } from './appoinment.controller';
import { Appoiments } from './appoinment.entity';

import { MailModule } from 'src/modules/mail/mail.module';
import { UserModule } from 'src/modules/users/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Appoiments]), MailModule, UserModule],
  providers: [AppoimentService],
  controllers: [AppoimentController],
})
export class AppoinmentModule {}
