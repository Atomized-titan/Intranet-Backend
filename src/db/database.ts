import { DataSource } from "typeorm";
import { User } from "../entity/User";

let AppDataSource: DataSource;

export const init = async () => {
  // Create TypeORM connection to the database
  AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "postgres",
    entities: [User],
    synchronize: true,
    logging: true,
  });

  // to initialize initial connection with the database, register all entities
  // and "synchronize" database schema, call "initialize()" method of a newly created database
  // once in your application bootstrap
  await AppDataSource.initialize();
};

export const getDatabase = () => AppDataSource;
