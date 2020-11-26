import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UsersModule } from '../src/domain/users/users.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Role } from '../src/domain/users/roles/role.entity';
import { User } from '../src/domain/users/user.entity';
import { MockRepository } from '../src/repository.mock';
import { FindConditions, Repository } from 'typeorm';
import { Subscription } from '../src/domain/subscriptions/subscription.entity';
import { Assignment } from '../src/domain/assignments/assignment.entity';
import { AppModule } from '../src/app.module';
import { JwtService } from '@nestjs/jwt';

describe('Users (e2e)', () => {
  const ME: Partial<User> = {
    id: 1,
  };
  let app: INestApplication;
  let usersRepository: Repository<User>;
  let requestWithAuth: request.Test;

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

    usersRepository = app.get<Repository<User>>(getRepositoryToken(User));

    await app.init();
  });

  beforeEach(async () => {
    const authBearer = 'Bearer ' + app.get<JwtService>(JwtService).sign({ sub: ME.id });
    requestWithAuth = request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', authBearer);
  });

  describe('when getting all users', () => {

    it('should return users with only queried fields', async () => {
      const users = [{
        ...ME,
        email: 'test@email.com',
        username: 'test-user',
      } as User];
      jest.spyOn(usersRepository, 'findOne').mockImplementationOnce(async (id: FindConditions<User>) => users.find(u => u.id === id));
      jest.spyOn(usersRepository, 'find').mockImplementation(async () => users);
      const response = await requestWithAuth.send({
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
      jest.spyOn(usersRepository, 'find').mockImplementation(async () => [user]);
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: '{ users { id, email, password } }',
        });
      expect(getErrors(response)).toEqual('Cannot query field \"password\" on type \"User\".');
    });

  });

  describe('When creating a user', () => {

    it('should deny Non-Administrator role', async () => {
      const users = [{
        ...ME,
        email: 'test@email.com',
        username: 'test-user',
        role: Promise.resolve({ name: 'NotActuallyAdministrator' }),
      } as User];
      jest.spyOn(usersRepository, 'findOne').mockImplementation(async (id: FindConditions<User>) => users.find(u => u.id === id));

      const response = await requestWithAuth.send({
        query: 'mutation UpdateUser($updateUserData: [UpdateUserInput!]!) { updateUser(updateUserData: $updateUserData) { id, email } }',
        variables: { updateUserData: [{ id: 1 }] },
      });
      expect(getErrors(response)).toEqual('Forbidden resource');
    });

    it('should allow Administrator role', async () => {
      const users = [{
        ...ME,
        email: 'test@email.com',
        username: 'test-user',
        role: Promise.resolve({ name: 'Administrator' }),
      } as User];
      jest.spyOn(usersRepository, 'findOne').mockImplementation(async (id: FindConditions<User>) => users.find(u => u.id === id));
      jest.spyOn(usersRepository, 'find').mockImplementation(async () => users);
      jest.spyOn(usersRepository, 'save').mockImplementation(async () => users as any);

      const response = await requestWithAuth.send({
        query: 'mutation UpdateUser($updateUserData: [UpdateUserInput!]!) { updateUser(updateUserData: $updateUserData) { id, email } }',
        variables: { updateUserData: [{ id: 1 }] },
      });
      expect(response.body.data.updateUser).toEqual([{ id: users[0].id, email: users[0].email }]);
    });

  });

  afterAll(async () => {
    await app.close();
  });

});

function getErrors(res: request.Response) {
  const resText = JSON.parse(res.text);
  const error = (resText.errors?.length) ? resText.errors[0] : resText.error;
  if (res.status === 200 && !error) return undefined;

  return error.message;
}
