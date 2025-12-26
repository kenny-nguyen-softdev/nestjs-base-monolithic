<p align="center">
  <a href="http://nestjs.com/" target="_blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" />
  </a>
</p>

<p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>

<p align="center">
  <a href="https://www.npmjs.com/~nestjscore" target="_blank">
    <img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" />
  </a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank">
    <img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" />
  </a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank">
    <img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" />
  </a>
  <a href="https://circleci.com/gh/nestjs/nest" target="_blank">
    <img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" />
  </a>
  <a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank">
    <img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master" alt="Coverage" />
  </a>
  <a href="https://discord.gg/G7Qnnhy" target="_blank">
    <img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/>
  </a>
  <a href="https://opencollective.com/nest#backer" target="_blank">
    <img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" />
  </a>
  <a href="https://opencollective.com/nest#sponsor" target="_blank">
    <img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" />
  </a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank">
    <img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate"/>
  </a>
  <a href="https://opencollective.com/nest#sponsor" target="_blank">
    <img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us">
  </a>
  <a href="https://twitter.com/nestframework" target="_blank">
    <img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow on Twitter">
  </a>
</p>

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```


---

### 🚀 Application Startup

```bash
$ npm run start          # Start the app in production mode
$ npm run start:dev      # Start in development mode with auto-reload
$ npm run start:debug    # Start in debug mode with auto-reload
$ npm run start:prod     # Run compiled app from dist/main.js
```

---

### 🛠️ Build & Code Quality

```bash
$ npm run build          # Compile TypeScript to JavaScript
$ npm run format         # Format code using Prettier
$ npm run lint           # Lint and fix code with ESLint
```

---

### ⚙️ NestJS Code Generator

```bash
$ npm run g:module <name>        # Generate a new module
$ npm run g:controller <name>    # Generate a new controller
$ npm run g:service <name>       # Generate a new service
$ npm run g:resource <name>      # Generate a full resource (CRUD module)
```

---

### 🔁 Migrations

```bash
$ npm run migration:create:name -- <MigrationName>  # Create or generate a new migration (name required)
$ npm run migration:generate:name -- <MigrationName> # Generate a new migration (name required)

$ npm run migration:show      # Show pending migrations
$ npm run migration:migrate   # Run all pending migrations
$ npm run migration:revert    # Revert the last applied migration
```

---

### 🌱 Database Seeding

```bash
$ npm run seed:create:name -- <SeedName>     # Create or generate a seed file (name required)
$ npm run seed:generate:name -- <SeedName>    # Generate a seed file (name required)

$ npm run seed:show       # Show pending seed migrations
$ npm run seed:migrate    # Apply all seed data
$ npm run seed:revert     # Revert the last applied seed

---

### Check eslint

```bash
$ npm run eslint    # Check eslint
```

---

### 🛡️ Git Hooks

```bash
$ npm run prepare         # Prepare Husky (Git hooks setup)
```

---

# FilteringParams Decorator

The `FilteringParams` decorator enables frontend developers to apply filtering and sorting capabilities to API endpoints by passing parameters in the query string.

## How to Use

### Query Parameter Syntax

- **Filtering**: Use the `filter` parameter to filter results.
  
  **Format**: 

Multiple filters can be combined with `&&`:

### Valid Filter Rules

The following filter rules are supported:

| Rule            | Meaning                       |
|-----------------|-------------------------------|
| `eq`            | Equals                        |
| `neq`           | Not equals                    |
| `gt`            | Greater than                  |
| `gte`           | Greater than or equals        |
| `lt`            | Less than                     |
| `lte`           | Less than or equals           |
| `like`          | Contains (SQL LIKE)           |
| `nlike`         | Does not contain (SQL NOT LIKE)|
| `in`            | Included in a set             |
| `nin`           | Not included in a set         |
| `isnull`        | Is NULL                       |
| `isnotnull`     | Is NOT NULL                   |

### Example Parameters

#### Sorting Example

- **Request**: `GET /your-route?sort=name:asc`
- **Description**: Sorts the results by `name` in ascending order.

#### Filtering Examples

1. **Range Filter**:
 - **Request**: `GET /your-route?filter=salePrice:gte:800000&&filter=salePrice:lte:31500000`
 - **Description**: Filters results where `salePrice` is greater than or equal to `800000` and less than or equal to `31500000`.

2. **In Filter**:
 - **Request**: `GET /your-route?filter=categoryId:in:["46ebc1ec-51d1-4057-874f-9ad110f1fc05"]`
 - **Description**: Filters results where `categoryId` is included in the specified array.

#### Including Related Data

- **Request**: `GET /your-route?include=category`
- **Description**: Includes the related `category` data in the response.

---

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil My�liwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
