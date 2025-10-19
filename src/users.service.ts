import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class UsersService implements OnModuleInit, OnModuleDestroy {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT || 5432),
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || 'postgres',
      database: process.env.DB_NAME || 'nest_proto'
    });
  }

  // create table if not exists
  async onModuleInit() {
    const client = await this.pool.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL
        )
      `);
      console.log('Ensured users table exists.');
    } finally {
      client.release();
    }
  }

  async onModuleDestroy() {
    await this.pool.end();
  }

  // return all users
  async findAll() {
    const res = await this.pool.query('SELECT id, name, email FROM users ORDER BY id');
    return res.rows;
  }

  // create a user, returns created row
  async create({ name, email }: { name: string; email: string }) {
    const res = await this.pool.query(
      `INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id, name, email`,
      [name, email]
    );
    return res.rows[0];
  }

  // convenience: find by id
  async findOne(id: number) {
    const res = await this.pool.query('SELECT id, name, email FROM users WHERE id = $1', [id]);
    return res.rows[0] || null;
  }
}
