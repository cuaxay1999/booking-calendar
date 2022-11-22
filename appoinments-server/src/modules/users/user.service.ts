import { UserCreateDto } from './dto/user-create.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Not, Repository } from 'typeorm';
//------------------------------------------------
import { generateHash } from 'src/utils/auth.util';

const ROLE = {
  ADMIN: 1,
  ASSISTANT: 2,
  USER: 3,
};

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>
  ) {}

  async get() {
    const [data, count] = await this.repository.findAndCount({
      where: {
        role: Not(ROLE.ADMIN),
      },
    });
    return {
      data,
      count,
    };
  }

  async findOne(phone: string): Promise<UserEntity | undefined> {
    return await this.repository.findOne({
      where: { phone },
    });
  }

  async getTypeUser() {
    return await this.repository.find({
      where: {
        role: ROLE.USER,
      },
    });
  }

  async findById(id: number): Promise<UserEntity | any> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...user } = await this.repository.findOne({
      where: { id },
    });
    return user;
  }

  async create(user: UserCreateDto) {
    const isPhoneExist = await this.repository.findOne({
      where: {
        phone: user.phone,
      },
    });

    if (isPhoneExist)
      throw new HttpException(
        'Số điện thoại đã được sử dụng. Vui lòng sử dụng sđt khác',
        HttpStatus.UNPROCESSABLE_ENTITY
      );

    const hashedPassword = generateHash(user.password);
    user.password = hashedPassword;
    const userCreated = this.repository.create(user);
    return await this.repository.save(userCreated);
  }

  async update(updateData: any, id: number) {
    return await this.repository.update(id, updateData);
  }
}
