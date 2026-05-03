const DEFAULT_BASE_URL = "https://peraturan.info";
const DEFAULT_MOUTHFUL_URL = "https://mouthful.inoxsegar.com";
const DEFAULT_DATA_REPO = "github:mblonyox/data-peraturan#main";
const DEFAULT_LOCAL_DATA_PATH = "../data-peraturan";
const DEFAULT_DATA_MODE = "local";

export const BASE_URL = process.env.BASE_URL ?? DEFAULT_BASE_URL;
export const DATA_REPO = process.env.DATA_REPO ?? DEFAULT_DATA_REPO;
export const LOCAL_DATA_PATH =
  process.env.LOCAL_DATA_PATH ?? DEFAULT_LOCAL_DATA_PATH;
export const MOUTHFUL_URL = process.env.MOUTHFUL_URL ?? DEFAULT_MOUTHFUL_URL;
export const DATA_MODE = process.env.DATA_MODE ?? DEFAULT_DATA_MODE;
