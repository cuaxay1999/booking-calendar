import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

import { UserEntity } from '../modules/users/user.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
@ValidatorConstraint({ name: 'UserRule', async: true })
export class UserRule implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>
  ) {}

  async validate(phone: string) {
    try {
      const user = await this.repository.findOne({
        where: {
          phone,
        },
      });
      if (user) return false;
      return true;
    } catch (e) {
      return false;
    }
  }

  defaultMessage() {
    return 'User has exist, please try other phonenumber';
  }
}
