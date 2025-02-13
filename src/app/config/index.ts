import dotenv from "dotenv";

dotenv.config();

const config = {
  node_env: process.env.NODE_MODULE,
  port: process.env.PORT,
};

export default config;
