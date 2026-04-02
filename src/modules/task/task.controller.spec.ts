import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './services/task.service';
import { TaskEntity } from 'src/shared/entities/task/task.entity';
import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { AuthenticatedRequest } from './protocols/authenticatedRequest.interface';

describe('TaskController', () => {
  let taskController: TaskController;
  let taskService: TaskService;

  const mockTask: TaskEntity = {
    id: 1,
    name: 'Test Task',
    description: 'Test Description',
    status: false,
    user_id: 1,
  } as TaskEntity;

  const mockTaskService = {
    findAllByUserId: jest.fn().mockResolvedValue([mockTask]),
    createTask: jest.fn().mockResolvedValue({
      statusCode: HttpStatus.CREATED,
      response: mockTask,
    }),
    deleteTask: jest.fn().mockResolvedValue({
      statusCode: HttpStatus.OK,
      response: { result: 'Tarefa deletada com sucesso' },
    }),
    updateTaskStatus: jest.fn().mockResolvedValue({
      statusCode: HttpStatus.OK,
      response: { result: 'Tarefa concluida', task: mockTask },
    }),
    editTask: jest.fn().mockResolvedValue({
      statusCode: HttpStatus.OK,
      response: { result: 'Tarefa atualizada com sucesso', task: mockTask },
    }),
  };

  const mockResponse = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
  } as unknown as Response;

  const mockRequest = {
    user: {
      sub: 1,
    },
  } as unknown as AuthenticatedRequest;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: TaskService,
          useValue: mockTaskService,
        },
      ],
    }).compile();

    taskController = module.get<TaskController>(TaskController);
    taskService = module.get<TaskService>(TaskService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(taskController).toBeDefined();
  });

  describe('getAllTasks', () => {
    it('should return tasks for user', async () => {
      await taskController.getAllTasks(mockRequest, mockResponse);
      expect(taskService.findAllByUserId).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.send).toHaveBeenCalledWith([mockTask]);
    });
  });

  describe('createTasks', () => {
    it('should create tasks', async () => {
      const taskToCreate = { ...mockTask };
      delete taskToCreate.id;

      await taskController.createTasks(taskToCreate as TaskEntity, mockRequest, mockResponse);

      expect(taskService.createTask).toHaveBeenCalledWith({ ...taskToCreate, user_id: 1 });
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(mockResponse.send).toHaveBeenCalledWith(mockTask);
    });
  });

  describe('deleteTask', () => {
    it('should delete task', async () => {
      await taskController.deleteTask('1', mockRequest, mockResponse);

      expect(taskService.deleteTask).toHaveBeenCalledWith(1, 1);
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.send).toHaveBeenCalledWith({ result: 'Tarefa deletada com sucesso' });
    });
  });

  describe('updateTaskStatus', () => {
    it('should update task status', async () => {
      await taskController.updateTaskStatus('1', true, mockRequest, mockResponse);

      expect(taskService.updateTaskStatus).toHaveBeenCalledWith(1, 1, true);
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.send).toHaveBeenCalledWith({ result: 'Tarefa concluida', task: mockTask });
    });
  });

  describe('editTask', () => {
    it('should edit task', async () => {
      const updateData = { name: 'Updated' };
      await taskController.editTask('1', updateData, mockRequest, mockResponse);

      expect(taskService.editTask).toHaveBeenCalledWith(1, 1, updateData);
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.send).toHaveBeenCalledWith({ result: 'Tarefa atualizada com sucesso', task: mockTask });
    });
  });
});
