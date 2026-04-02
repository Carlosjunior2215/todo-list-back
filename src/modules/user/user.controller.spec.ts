import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './services/user/user.service';
import { UserEntity } from 'src/shared/entities/user/user.entity';
import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  const mockUser: UserEntity = {
    id: 1,
    name: 'JOSELITO',
    email: 'ZEQUINHA@12.COM',
    password: '123',
  } as UserEntity;

  const mockUserService = {
    findAll: jest.fn().mockResolvedValue([mockUser]),
    createUser: jest.fn().mockResolvedValue({
      statusCode: HttpStatus.CREATED,
      response: mockUser,
    }),
  };

  const mockResponse = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
  } as unknown as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const result = await userController.getAllUsers();
      expect(result).toEqual([mockUser]);
      expect(userService.findAll).toHaveBeenCalled();
    });
  });

  describe('createtUser', () => {
    it('should create a user and return response', async () => {
      const userToCreate = { ...mockUser };
      delete userToCreate.id;

      await userController.createtUser(userToCreate as UserEntity, mockResponse);

      expect(userService.createUser).toHaveBeenCalledWith(userToCreate);
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(mockResponse.send).toHaveBeenCalledWith(mockUser);
    });
  });
});
