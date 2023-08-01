import { getDatabase } from "../orm/dbConnection";
import { User } from "../orm/entities/User";
import bcrypt from "bcrypt";

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

export const getUserByEmailSvc = async (email: string) => {
  const user = await getDatabase()
    .getRepository(User)
    .findOne({ where: { email } });
  return user;
};

export const addUserSvc = async (
  name: string,
  email: string,
  password: string
) => {
  const user = new User();
  user.name = name;
  user.email = email;
  user.password = await bcrypt.hash(password, 10); // Hash the password with a salt of 10 rounds

  const newUser = await getDatabase().getRepository(User).save(user);
  return newUser;
};

export const updateUserSvc = async (
  id: number,
  name: string,
  email: string,
  password: string
) => {
  const user = await getDatabase()
    .getRepository(User)
    .findOne({ where: { id } });
  if (!user) {
    throw new Error("User not found");
  }

  if (name) {
    user.name = name;
  }

  if (email) {
    user.email = email;
  }

  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }

  const updatedUser = await getDatabase().getRepository(User).save(user);
  return updatedUser;
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
