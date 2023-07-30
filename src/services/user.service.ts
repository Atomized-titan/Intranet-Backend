import { getDatabase } from "../db/database";
import { User } from "../entity/User";

export const getAllUsersSvc = async () => {
  const users = await getDatabase().getRepository(User).find();
  return users;
};
