import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

class ConfigService {

  constructor(private env: { [k: string]: string | undefined }) { }

  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach(k => this.getValue(k, true));
    return this;
  }

  public getPort() {
    return this.getValue('PORT', true);
  }

  public isProduction() {
    const mode = this.getValue('APP_ENV', false);
    return mode !== 'development';
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: this.getValue('DB_CONNECTION') as any,

      host: this.getValue('DB_HOST'),
      port: parseInt(this.getValue('DB_PORT')),
      username: this.getValue('DB_USERNAME'),
      password: this.getValue('DB_PASSWORD'),
      database: this.getValue('DB_DATABASE'),

      entities: [path.join(__dirname, '../**/*.entity{.ts,.js}')],

      migrationsTableName: 'migration',
      migrations: [path.join(__dirname, '../database/migrations/*{.ts,.js}')],
      cli: {
        migrationsDir: 'src/database/migrations',
      },

      ssl: this.isProduction(),
    };
  }

}

const configService = new ConfigService(process.env)
  .ensureValues([
    'DB_HOST',
    'DB_PORT',
    'DB_USERNAME',
    'DB_PASSWORD',
    'DB_DATABASE'
  ]);

export { configService };