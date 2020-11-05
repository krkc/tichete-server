import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UsersModule } from '../src/domain/users/users.module';
import { UsersService } from '../src/domain/users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Role } from '../src/domain/users/roles/role.entity';
import { User } from '../src/domain/users/user.entity';
import { MockRepository } from '../src/repository.mock';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  const usersService = { getMany: () => ({ data: [ {} ] }) };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
    })
      .overrideProvider(UsersService)
      .useValue(usersService)
      .overrideProvider(getRepositoryToken(User))
      .useClass(MockRepository)
      .overrideProvider(getRepositoryToken(Role))
      .useClass(MockRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/users (GET)', () => {
    return request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .expect(usersService.getMany());
  });

  afterAll(async () => {
    await app.close();
  });
});
