import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserEntity } from '../../../../shared/entities/user/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';

describe('userService', () => {
  let userService: UserService;
  let userRepository: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            find: jest.fn(() =>
              Promise.resolve([
                {
                  id: 1,
                  name: 'JOSELITO',
                  email: 'ZEQUINHA@12.COM',
                  password: '123',
                },
              ]),
            ),
            findOneBy: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = module.get(UserService);
    userRepository = module.get(getRepositoryToken(UserEntity));
  });

  it('service should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('should return users', async () => {
    const users = await userService.findAll();

    expect(users).toEqual([
      {
        id: 1,
        name: 'JOSELITO',
        email: 'ZEQUINHA@12.COM',
        password: '123',
      },
    ]);
  });

  it('should not create user if it already exists', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue({
      id: 1,
      name: 'JOSELITO',
      email: 'ZEQUINHA@12.COM',
      password: '123',
    } as UserEntity);
    
    const response = await userService.createUser({
      name: 'JOSELITO',
      email: 'ZEQUINHA@12.COM',
      password: '123',
    } as UserEntity);

    expect(response).toEqual({
      statusCode: HttpStatus.FOUND,
      response: { result: 'user already exist' },
    });
  });
});
