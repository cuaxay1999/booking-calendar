import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendNotification(name, time, email) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Xác nhận thông tin gặp mặt',
      template: './confirm.html', // either change to ./transactional or rename transactional.html to confirmation.html
      context: {
        name,
        time,
      },
    });
  }
}
