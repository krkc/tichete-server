/**
 * This script, run from package.json prior to the migration scripts,
 * generates a fresh ormconfig.json so that the config service can be
 * shared between the main nest app and the TypeOrm migration cli.
 */
import { configService } from '../config/typeormconfig.service';
import fs = require('fs');fs.writeFileSync('ormconfig.json',
 JSON.stringify(configService.getTypeOrmConfig(), null, 2)
);
