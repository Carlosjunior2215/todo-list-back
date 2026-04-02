import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { TaskEntity } from 'src/shared/entities/task/task.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpStatus } from '@nestjs/common';

describe('TaskService', () => {
  let taskService: TaskService;
  let taskRepository: Repository<TaskEntity>;

  const mockTask: TaskEntity = {
    id: 1,
    name: 'Test Task',
    description: 'Test Description',
    status: false,
    user_id: 1,
  } as TaskEntity;

  const mockTaskRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getRepositoryToken(TaskEntity),
          useValue: mockTaskRepository,
        },
      ],
    }).compile();

    taskService = module.get<TaskService>(TaskService);
    taskRepository = module.get<Repository<TaskEntity>>(getRepositoryToken(TaskEntity));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(taskService).toBeDefined();
  });

  describe('findAllByUserId', () => {
    it('should return tasks for a user', async () => {
      mockTaskRepository.find.mockResolvedValue([mockTask]);
      const result = await taskService.findAllByUserId(1);
      expect(result).toEqual([mockTask]);
      expect(mockTaskRepository.find).toHaveBeenCalledWith({ where: { user_id: 1 } });
    });
  });

  describe('createTask', () => {
    it('should create a task', async () => {
      mockTaskRepository.findOne.mockResolvedValue(null);
      mockTaskRepository.save.mockResolvedValue(mockTask);

      const result = await taskService.createTask(mockTask);

      expect(result).toEqual({ statusCode: HttpStatus.CREATED, response: mockTask });
      expect(mockTaskRepository.save).toHaveBeenCalledWith(mockTask);
    });

    it('should return error if task already exists', async () => {
      mockTaskRepository.findOne.mockResolvedValue(mockTask);

      const result = await taskService.createTask(mockTask);

      expect(result).toEqual({
        statusCode: HttpStatus.FOUND,
        response: { result: 'Tarefa já existe, tente outro nome' },
      });
    });
  });

  describe('deleteTask', () => {
    it('should delete a task', async () => {
      mockTaskRepository.findOne.mockResolvedValue(mockTask);
      mockTaskRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await taskService.deleteTask(1, 1);

      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        response: { result: 'Tarefa deletada com sucesso' },
      });
      expect(mockTaskRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should return error if task not found', async () => {
      mockTaskRepository.findOne.mockResolvedValue(null);

      const result = await taskService.deleteTask(1, 1);

      expect(result).toEqual({
        statusCode: HttpStatus.NOT_FOUND,
        response: { result: 'Tarefa não encontrada' },
      });
    });
  });

  describe('updateTaskStatus', () => {
    it('should update task status', async () => {
      mockTaskRepository.findOne.mockResolvedValue({ ...mockTask });
      mockTaskRepository.save.mockResolvedValue({ ...mockTask, status: true });

      const result = await taskService.updateTaskStatus(1, 1, true);

      expect(result.statusCode).toEqual(HttpStatus.OK);
      expect(result.response.result).toEqual('Tarefa concluida');
      expect(result.response.task.status).toBe(true);
    });

    it('should return error if task not found for update', async () => {
      mockTaskRepository.findOne.mockResolvedValue(null);

      const result = await taskService.updateTaskStatus(1, 1, true);

      expect(result).toEqual({
        statusCode: HttpStatus.NOT_FOUND,
        response: { result: 'task not found' },
      });
    });
  });

  describe('editTask', () => {
    it('should edit task successfully', async () => {
      mockTaskRepository.findOne.mockResolvedValueOnce({ ...mockTask }); // first find for task exists
      mockTaskRepository.findOne.mockResolvedValueOnce(null); // second find for name conflict
      mockTaskRepository.save.mockResolvedValue({ ...mockTask, name: 'Updated Name' });

      const result = await taskService.editTask(1, 1, { name: 'Updated Name' });

      expect(result.statusCode).toEqual(HttpStatus.OK);
      expect(result.response.result).toEqual('Tarefa atualizada com sucesso');
    });

    it('should return error if task not found for edit', async () => {
      mockTaskRepository.findOne.mockResolvedValue(null);

      const result = await taskService.editTask(1, 1, { name: 'Updated Name' });

      expect(result).toEqual({
        statusCode: HttpStatus.NOT_FOUND,
        response: { result: 'Tarefa não encontrada' },
      });
    });

    it('should return error if new name already exists', async () => {
        mockTaskRepository.findOne.mockResolvedValueOnce({ ...mockTask }); // task exists
        mockTaskRepository.findOne.mockResolvedValueOnce({ id: 2, name: 'Other Task' }); // name exists

        const result = await taskService.editTask(1, 1, { name: 'Other Task' });

        expect(result).toEqual({
          statusCode: HttpStatus.FOUND,
          response: { result: 'Tarefa já existe, tente outro nome' },
        });
      });
  });
});
