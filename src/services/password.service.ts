import bycript from "bcrypt";

const SALT_ROUNDS = 10;

export const hashPassword = async (password: string): Promise<string> => {
  return await bycript.hash(password, SALT_ROUNDS);
};
export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return await bycript.compare(password, hash);
};
