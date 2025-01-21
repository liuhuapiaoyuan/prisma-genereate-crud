# Prisma Class Validator Generator

[![npm version](https://badge.fury.io/js/prisma-crud.svg)](https://badge.fury.io/js/prisma-crud)
[![npm](https://img.shields.io/npm/dt/prisma-crud.svg)](https://www.npmjs.com/package/prisma-crud)
[![HitCount](https://hits.dwyl.com/omar-dulaimi/prisma-crud.svg?style=flat)](http://hits.dwyl.com/omar-dulaimi/prisma-crud)
[![npm](https://img.shields.io/npm/l/prisma-crud.svg)](LICENSE)

Automatically generate typescript models of your database with class validator validations ready, from your [Prisma](https://github.com/prisma/prisma) Schema. Updates every time `npx prisma generate` runs.

<p align="center">
  <a href="https://www.buymeacoffee.com/omardulaimi">
    <img src="https://cdn.buymeacoffee.com/buttons/default-black.png" alt="Buy Me A Coffee" height="41" width="174">
  </a>
</p>

## Table of Contents

- [Supported Prisma Versions](#supported-prisma-versions)
- [Installation](#installing)
- [Usage](#usage)
- [Additional Options](#additional-options)

# Supported Prisma Versions

Probably no breaking changes for this library, so try newer versions first.

Note: Starting from Prisma v5, library versions will match Prisma versions.

### Prisma 5

- 5.0.0 and higher

### Prisma 4

- 0.2.0 and higher

### Prisma 2/3

- 0.1.1 and lower

## Installation

Using npm:

```bash
 npm install prisma-crud
```

Using yarn:

```bash
 yarn add prisma-crud
```

# Usage

1- Star this repo 😉

2- Add the generator to your Prisma schema

```prisma
generator class_validator {
  provider = "prisma-crud"
}
```

3- Running `npx prisma generate` for the following schema.prisma

```prisma
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
  posts Post[]
}

model Post {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  title     String
  content   String?
  published Boolean  @default(false)
  viewCount Int      @default(0)
  author    User?    @relation(fields: [authorId], references: [id])
  authorId  Int?
  rating    Float
}
```

will generate the following files

![Typescript models with class validator](https://raw.githubusercontent.com/omar-dulaimi/prisma-crud/master/classValidatorModels.png)

Inside `User` model:

```ts
import { IsInt, IsDefined, IsString, IsOptional } from "class-validator";
import { Post } from "./";

export class User {
    @IsDefined()
    @IsInt()
    id!: number;

    @IsDefined()
    @IsString()
    email!: string;

    @IsOptional()
    @IsString()
    name?: string;

    @IsDefined()
    posts!: Post[];
}

```

## Additional Options

| Option   |  Description                              | Type     |  Default      |
| -------- | ----------------------------------------- | -------- | ------------- |
| `output` | Output directory for the generated models | `string` | `./generated` |

Use additional options in the `schema.prisma`

```prisma
generator class_validator {
  provider   = "prisma-crud"
  output     = "./generated-models"
}
```
