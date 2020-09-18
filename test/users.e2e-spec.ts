import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UsersModule } from './../src/users/users.module';
import { UsersService } from './../src/users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Role } from './../src/roles/role.entity';
import { Repository } from 'typeorm';
import { User } from './../src/users/user.entity';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  const usersService = { findAll: () => ({ data: [ {} ] }) };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
    })
      .overrideProvider(UsersService)
      .useValue(usersService)
      .overrideProvider(getRepositoryToken(User))
      .useClass(Repository)
      .overrideProvider(getRepositoryToken(Role))
      .useClass(Repository)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/users (GET)', () => {
    return request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .expect(usersService.findAll());
  });

  afterAll(async () => {
    await app.close();
  });
});
