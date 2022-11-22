import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Appoiments } from './appoinment.entity';
import { Like, Repository } from 'typeorm';

import { MailService } from 'src/modules/mail/mail.service';
import { UserService } from 'src/modules/users/user.service';
@Injectable()
export class AppoimentService {
  constructor(
    @InjectRepository(Appoiments)
    private readonly repository: Repository<Appoiments>,
    private readonly mailService: MailService,
    private readonly userService: UserService
  ) {}

  async get(user: any) {
    let filters: any = { user_id: user.userId };
    if (user.role === 2) {
      filters = {
        status: 2,
      };
    }
    const [data, count] = await this.repository.findAndCount({
      where: filters,
      order: { created_at: 'DESC' },
    });
    return {
      data,
      count,
    };
  }

  async create(appoinment: any) {
    appoinment.accepted_date = appoinment.date;
    appoinment.accepted_time = appoinment.time;

    const appoinmentCreated = this.repository.create(appoinment);
    return await this.repository.save(appoinmentCreated);
  }

  async update(updateData: any, id: number) {
    return await this.repository.update({ id }, updateData);
  }

  async acceptAppointment(updateData: any, id: number, user: any) {
    const res = await this.repository.update({ id }, updateData);
    if (res.affected) {
      const userFinded = await this.repository.find({ where: { id: id } });

      const time = updateData.accepted_time + ' ' + updateData.accepted_date;
      await this.mailService.sendNotification(userFinded[0].user_name, time, userFinded[0].user_email);
      return {
        message: 'Update successfully',
      };
    }
    return user;
    // const user;
  }

  async search(keyword: string) {
    const [data, count] = await this.repository.findAndCount({
      where: {
        user_ccid: Like(`%${keyword}%`),
      },
    });

    return {
      data,
      count,
    };
  }
}
