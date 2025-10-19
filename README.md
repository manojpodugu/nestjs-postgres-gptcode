# nestjs-postgres-gptcode
A nestjs-postgresql code by chatgpt


--------------------------------------
Nice — here’s a very small, functional NestJS prototype that uses pg (node-postgres) directly (no TypeORM) and is easy to run. It keeps everything minimal: a single Users service that creates the users table on startup and exposes GET /users and POST /users
--------------------------------------
# project structure #

nest-postgres-proto/
├─ package.json
├─ .env.example
└─ src/
   ├─ main.ts
   ├─ app.module.ts
   ├─ users.service.ts
   └─ users.controller.ts
