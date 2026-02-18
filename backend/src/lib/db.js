import { Sequelize } from 'sequelize';
import fs from 'fs';
import path from 'path';

import { defineModels } from '../models/index.js';

let sequelize = null;

export function getSequelize() {
  if (!sequelize) throw new Error('DB not initialized');
  return sequelize;
}

export async function initDb() {
  const storage = process.env.DB_STORAGE || './data/dev.sqlite';
  const absStorage = path.resolve(storage);
  const dir = path.dirname(absStorage);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: absStorage,
    logging: false,
  });

  defineModels(sequelize);

  await sequelize.authenticate();
  await sequelize.sync({ alter: true }); // MVP convenience (not migrations)
  console.log('[db] ready:', absStorage);
}
