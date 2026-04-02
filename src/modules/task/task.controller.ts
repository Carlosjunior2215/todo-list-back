import { Body, Controller, Get, Post, Res, Req, UseGuards, Query, Delete, Param, Patch, Put } from '@nestjs/common';
import { TaskEntity } from 'src/shared/entities/task/task.entity';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TaskService } from './services/task.service';
import { AuthenticatedRequest } from './protocols/authenticatedRequest.interface';


@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllTasks(@Req() req: AuthenticatedRequest, @Res() res: Response): Promise<any> {
    const tasks = await this.taskService.findAllByUserId(+req.user.sub);

    res.status(200).send(tasks)
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createTasks(
    @Body() task: TaskEntity,
    @Req() req: AuthenticatedRequest,
    @Res() res: Response
  ): Promise<any> {
    task.user_id = req.user.sub;

    const serviceResult = await this.taskService.createTask(task);

    return res.status(serviceResult.statusCode).send(serviceResult.response);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteTask(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
    @Res() res: Response
  ): Promise<any> {
    const serviceResult = await this.taskService.deleteTask(+id, +req.user.sub);

    return res.status(serviceResult.statusCode).send(serviceResult.response);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  async updateTaskStatus(
    @Param('id') id: string,
    @Body('status') status: boolean,
    @Req() req: AuthenticatedRequest,
    @Res() res: Response
  ): Promise<any> {
    const serviceResult = await this.taskService.updateTaskStatus(+id, +req.user.sub, status);

    return res.status(serviceResult.statusCode).send(serviceResult.response);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async editTask(
    @Param('id') id: string,
    @Body() updateData: Partial<TaskEntity>,
    @Req() req: AuthenticatedRequest,
    @Res() res: Response
  ): Promise<any> {
    const serviceResult = await this.taskService.editTask(+id, +req.user.sub, updateData);

    return res.status(serviceResult.statusCode).send(serviceResult.response);
  }
}
