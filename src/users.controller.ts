import { Body, Controller, Get, Param, ParseIntPipe, Post, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly svc: UsersService) {}

  @Get()
  async all() {
    return this.svc.findAll();
  }

  @Get(':id')
  async one(@Param('id', ParseIntPipe) id: number) {
    const user = await this.svc.findOne(id);
    if (!user) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    return user;
  }

  // expects JSON: { "name": "Alice", "email": "alice@example.com" }
  @Post()
  async create(@Body() body: { name?: string; email?: string }) {
    const { name, email } = body || {};
    if (!name || !email) {
      throw new HttpException('name and email required', HttpStatus.BAD_REQUEST);
    }
    try {
      const created = await this.svc.create({ name, email });
      return created;
    } catch (err: any) {
      // simple duplicate-email handling
      if (err?.code === '23505') {
        throw new HttpException('email already exists', HttpStatus.CONFLICT);
      }
      console.error(err);
      throw new HttpException('internal error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

