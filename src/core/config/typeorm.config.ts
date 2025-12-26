import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

export const getTypeOrmConfig = (configService: ConfigService): TypeOrmModuleAsyncOptions =>
  ({
    type: 'postgres',
    host: configService.get('DATABASE_HOST') as string,
    port: configService.get('DATABASE_PORT') as number,
    username: configService.get('DATABASE_USER') as string,
    password: configService.get('DATABASE_PASSWORD') as string,
    database: configService.get('DATABASE_DB') as string,
    schema: configService.get('DATABASE_SCHEMA') as string,
    entities: ['dist/**/*.entity{.ts,.js}'],
    synchronize: false,
    autoLoadEntities: true,
    migrations: [__dirname + '/src/migrations/**/*{.ts,.js}'],
    seeds: [__dirname + '/src/seeds/**/*{.ts,.js}'],
    factories: [__dirname + '/src/factories/**/*{.ts,.js}'],
    cli: {
      migrationsDir: __dirname + '/src/migrations/',
    },
  }) as TypeOrmModuleAsyncOptions;

const dataSourceMap = new Map<string, DataSource>();

/**
 * Returns a TypeORM DataSource instance for the given schema.
 * If the schema is not found in the internal cache, a new instance is created.
 * The instance is then cached for future requests.
 * @param schema The schema to retrieve the DataSource for.
 * @returns A Promise that resolves to the requested DataSource.
 */
export async function getTenantDataSource(schema: string) {
  if (dataSourceMap.has(schema)) {
    return dataSourceMap.get(schema);
  }

  const ds = new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DB,
    schema,
    entities: ['dist/**/*.entity.js'],
    synchronize: false,
  });

  await ds.initialize();
  dataSourceMap.set(schema, ds);
  return ds;
}
