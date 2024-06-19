import bcrypt from 'bcryptjs';


const cryptService = {
  hash: async (string: string, number: number): Promise<string> => {
    return await bcrypt.hash(string, number);
  },
  compare: async (string: string, hash: string): Promise<boolean> => {
    return await bcrypt.compare(string, hash);
  }
};

export default cryptService;
