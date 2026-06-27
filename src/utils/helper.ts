import * as bcrypt from 'bcrypt';

const salt = 10;

export const hashPasswordHelper = async (password: string) => {
  try {
    return await bcrypt.hash(password, salt);
  } catch (error) {
    console.log('🚀 ~ hashPassword ~ error:', error);
  }
};

export const comparePasswordHelper = async (password: string, hashedPassword: string) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    console.log('🚀 ~ comparePassword ~ error:', error);
  }
};
