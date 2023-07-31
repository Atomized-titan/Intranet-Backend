import { getDatabase } from "../db/database";
import { User } from "../entity/User";

export const getAllUsersSvc = async () => {
  const users = await getDatabase().getRepository(User).find();
  return users;
};

export const getUserByIdSvc = async (id: number) => {
  const user = await getDatabase()
    .getRepository(User)
    .findOne({ where: { id } });
  return user;
};

export const addUserSvc = async (name: string, email: string) => {
  const user = new User();
  user.name = name;
  user.email = email;

  const newUser = await getDatabase().getRepository(User).save(user);
  return newUser;
};

export const deleteUserSvc = async (id: number) => {
  const userToDelete = await getDatabase()
    .getRepository(User)
    .findOne({ where: { id } });
  if (!userToDelete) {
    throw new Error("User not found");
  }

  await getDatabase().getRepository(User).delete(id);
};
