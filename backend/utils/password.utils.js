import bcrypt from "bcrypt";

export const hashPassword = async (password) => {

  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, 10);

};

export const comparePassword = async (password, hash) => {

  return await bcrypt.compare(password, hash);

};
export const validatePassword = (password) => {
  const minLength = password.length >= 8;
  const upper = /[A-Z]/.test(password);
  const lower = /[a-z]/.test(password);
  const number = /[0-9]/.test(password);

  return minLength && upper && lower && number;
};