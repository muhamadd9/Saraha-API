import bcrypt from "bcrypt";

export const generateHash = ({ plainText, rounds = process.env.ROUNDS }) => {
  return bcrypt.hashSync(plainText, rounds);
};

export const compareHash = ({ plainText, hash }) => {
  return bcrypt.compareSync(plainText, hash);
};
