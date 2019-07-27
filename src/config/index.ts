import * as path from "path";
import fs from 'fs';

export const baseDir = path.resolve(__dirname, '../../');
export const ENVIRONMENT = process.env.NODE_ENV || "development";
export const IS_DEV_MODE = ENVIRONMENT === "development";
export const proceduresConfigPath = path.join(baseDir, 'src/config/procedures.json');
export const tablesConfigPath = path.join(baseDir, 'src/config/tables.json');
export const proceduresConfig = JSON.parse(fs.readFileSync(proceduresConfigPath, 'utf8'));
export const tablesConfig = JSON.parse(fs.readFileSync(tablesConfigPath, 'utf8'));
export const jwtExpires = process.env.JWT_EXPIRESS || '24h';
export const jwtSecret = process.env.JWT_SECRET || 'secret';
export const stripeApiKey = process.env.STRIPE_API_KEY || '';
export const stripeDefaultCurrency = process.env.STRIPE_DEFAULT_CURRENCY || 'usd';
export const stripeEndpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
