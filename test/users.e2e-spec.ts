import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UsersModule } from '../src/domain/users/users.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Role } from '../src/domain/users/roles/role.entity';
import { User } from '../src/domain/users/user.entity';
import { MockRepository } from '../src/repository.mock';
import { Repository } from 'typeorm';
import { Subscription } from '../src/domain/subscriptions/subscription.entity';
import { Assignment } from '../src/domain/assignments/assignment.entity';
import { AppModule } from '../src/app.module';

describe('Users (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;

  beforeAll(async () => {

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, UsersModule],
    })
      .overrideProvider(getRepositoryToken(User))
      .useClass(MockRepository)
      .overrideProvider(getRepositoryToken(Role))
      .useClass(MockRepository)
      .overrideProvider(getRepositoryToken(Subscription))
      .useClass(MockRepository)
      .overrideProvider(getRepositoryToken(Assignment))
      .useClass(MockRepository)
      .compile();

    app = moduleFixture.createNestApplication();

    userRepository = app.get<Repository<User>>(getRepositoryToken(User));

    await app.init();
  });

  describe('when getting all users', () => {
    // TODO: Test for missing auth header and add it for the other tests
    it('should return users with only queried fields', async () => {

      const users = [{
        id: 1,
        email: 'test@email.com',
        username: 'test-user',
      } as User];
      jest.spyOn(userRepository, 'find').mockImplementation(async () => users);
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: '{ users { id, email } }',
        });
      expect(getErrors(response)).toBeUndefined();
      expect(response.body.data.users).toEqual([{ id: users[0].id, email: users[0].email }]);

    });

    it('should not return passwords', async () => {

      const user = {
        id: 1,
        email: 'test@email.com',
        password: 'testPassword'
      } as User;
      jest.spyOn(userRepository, 'find').mockImplementation(async () => [user]);
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: '{ users { id, email, password } }',
        });
      expect(getErrors(response)[0].message).toEqual('Cannot query field \"password\" on type \"User\".');

    });

  });

  afterAll(async () => {
    await app.close();
  });

});

function getErrors(res: request.Response) {
  const resText = JSON.parse(res.text);
  if (res.status === 200 && !resText.errors && !resText.error) return undefined;

  return resText.errors || resText;
}
