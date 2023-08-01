import { DataSource } from "typeorm";
import config from "./config/ormconfig";

let AppDataSource: DataSource;

export const initializeDataSource = async () => {
  // Create TypeORM connection to the database
  AppDataSource = new DataSource(config);

  // to initialize initial connection with the database, register all entities
  // and "synchronize" database schema, call "initialize()" method of a newly created database
  // once in your application bootstrap
  await AppDataSource.initialize()
    .then(() => {
      console.log("Data Source has been initialized!");
    })
    .catch((err) => {
      console.error("Error during Data Source initialization", err);
    });
};

export const getDatabase = () => AppDataSource;
