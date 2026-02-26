import { Injectable } from '@nestjs/common';
import { Role } from './enums/role.enum';
import { hashPassword } from '../auth/utils/hash.util';
import { User } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  private users: User[] = [];

  constructor() {
    void this.seed();
  }

  async seed() {
    const password = await hashPassword('password123');

    this.users.push({
      id: '1',
      email: 'admin@test.com',
      passwordHash: password,
      role: Role.ADMIN,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  findByEmail(email: string): User | undefined {
    return this.users.find((u) => u.email === email);
  }
}
