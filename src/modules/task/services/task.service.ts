import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { httpResponseInterface } from 'src/shared/protocols/interfaces/httpResponse.interface';
import { Repository } from 'typeorm';
import { TaskEntity } from 'src/shared/entities/task/task.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity)
    private taskRepository: Repository<TaskEntity>,
  ) {}

  async findAllByUserId(user_id: number): Promise<TaskEntity[] | undefined> {
    return await this.taskRepository.find({
      where: { user_id },
    });
  }

  async createTask(task: TaskEntity): Promise<httpResponseInterface> {
   const isFoundedTask = await this.isFoundedTask(task.name);

    if(isFoundedTask) {
      return isFoundedTask;
    }

    const response = await this.taskRepository.save(task);

    return { statusCode: HttpStatus.CREATED, response };
  }

  async deleteTask(id: number, user_id: number): Promise<httpResponseInterface> {
    const task = await this.taskRepository.findOne({
      where: { id, user_id },
    });

    if (!task) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        response: { result: 'Tarefa não encontrada' },
      };
    }

    await this.taskRepository.delete(id);

    return {
      statusCode: HttpStatus.OK,
      response: { result: 'Tarefa deletada com sucesso' },
    };
  }

  async updateTaskStatus(id: number, user_id: number, status: boolean): Promise<httpResponseInterface> {
    const task = await this.taskRepository.findOne({
      where: { id, user_id },
    });

    if (!task) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        response: { result: 'task not found' },
      };
    }

    task.status = status;
    await this.taskRepository.save(task);

    return {
      statusCode: HttpStatus.OK,
      response: { result: 'Tarefa concluida', task },
    };
  }

  async editTask(id: number, user_id: number, updateData: Partial<TaskEntity>): Promise<httpResponseInterface> {
    const task = await this.taskRepository.findOne({
      where: { id, user_id },
    });

    if (!task) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        response: { result: 'Tarefa não encontrada' },
      };
    }

    const isFoundedTask = await this.isFoundedTask(updateData.name as string);

    if(isFoundedTask) {
      return isFoundedTask;
    }

    await this.taskRepository.save({...task, ...updateData});

    return {
      statusCode: HttpStatus.OK,
      response: { result: 'Tarefa atualizada com sucesso', task },
    };
  }

   private async findByName(name: string): Promise<TaskEntity | null> {
    const task: TaskEntity | null = await this.taskRepository.findOne({
      where: { name },
    });

    return task;
  }

  private async isFoundedTask(name: string): Promise<httpResponseInterface | void> {
    const isFoundedTask = await this.findByName(name);

    if(isFoundedTask) {
      return {
        statusCode: HttpStatus.FOUND,
        response: { result: 'Tarefa já existe, tente outro nome' },
      };
    }

    return
  }
}
