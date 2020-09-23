import { INestApplicationContext, Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import * as commandLineArgs from 'command-line-args';
import { CommandLineArgsOptions, Seeder } from "../database/seeders/seeder";
import { SeederModule } from "../database/seeders/seeder.module";

const seederArgsInterface: commandLineArgs.OptionDefinition[] = [
  { name: 'prod', alias: 'p', type: Boolean },
];

/**
 * This script, run from package.json, starts a standalone nest application
 * which handles seeding the database.
 */
async function bootstrap() {
  let appContext: INestApplicationContext;
  try {
    appContext = await NestFactory.createApplicationContext(SeederModule);
  } catch (error) {
    throw error;
  }

  const logger = appContext.get(Logger);
  const seeder = appContext.get(Seeder);
  try {
    await seeder.run(commandLineArgs(seederArgsInterface) as CommandLineArgsOptions);
    logger.debug('Seeding complete!');
  } catch (error) {
    logger.error('Seeding failed!');
    throw error;
  } finally {
    appContext.close();
  }
}
bootstrap();
