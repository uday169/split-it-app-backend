import { AppError } from '../middleware/errorHandler';
import userRepository from '../repositories/user.repository';
import { User } from '../types';

export class UserService {
  async getUserById(userId: string): Promise<User> {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new AppError(404, 'User not found', 'USER_NOT_FOUND');
    }

    return user;
  }

  async getCurrentUser(userId: string): Promise<User> {
    return this.getUserById(userId);
  }

  async updateUser(userId: string, name: string): Promise<User> {
    const user = await userRepository.update(userId, { name });

    if (!user) {
      throw new AppError(404, 'User not found', 'USER_NOT_FOUND');
    }

    return user;
  }
}

export default new UserService();
