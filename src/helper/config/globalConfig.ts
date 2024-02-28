import * as dotenv from 'dotenv';
dotenv.config();

interface GlobalConfig {
    POSTGRES_DB: string
    POSTGRES_HOST: string
    POSTGRES_PORT: number | undefined
    POSTGRES_USER: string
    POSTGRES_PASSWORD: string
    HOST_PORT: number | undefined
    JWT_SECRET_KEY: string
    KAFKA_HOSTS: string
    MONGODB_URI: string
}

const config: GlobalConfig = {
  POSTGRES_DB: process.env.POSTGRES_DB as string,
  POSTGRES_HOST: process.env.POSTGRES_HOST as string,
  POSTGRES_PORT: process.env.POSTGRES_PORT as unknown as number,
  POSTGRES_USER: process.env.POSTGRES_USER as unknown as string,
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD as unknown as string,
  HOST_PORT: process.env.HOST_PORT as unknown as number,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY as string,
  KAFKA_HOSTS: process.env.KAFKA_HOSTS as string,
  MONGODB_URI: process.env.MONGODB_URI as string
};

export {config, GlobalConfig};