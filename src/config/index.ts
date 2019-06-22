import * as path from "path";

export const baseDir = path.resolve(__dirname, '../../');
export const ENVIRONMENT = process.env.NODE_ENV || "development";
export const IS_DEV_MODE = ENVIRONMENT === "development";
