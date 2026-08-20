const DEFAULT_BASE_URL = import.meta.env.DEV
  ? "http://localhost:4321"
  : "https://peraturan.info";
const DEFAULT_DATA_URL = import.meta.env.DEV
  ? "http://localhost:8000/"
  : "https://raw.githubusercontent.com/mblonyox/data-peraturan/main/";

export const BASE_URL = process.env.BASE_URL ?? DEFAULT_BASE_URL;
export const DATA_URL = process.env.DATA_URL ?? DEFAULT_DATA_URL;
