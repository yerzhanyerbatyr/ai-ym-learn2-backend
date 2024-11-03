import User, { IUser } from '../models/userModel';

// Create a new user
export const createUser = async (userData: IUser) => {
  const user = new User(userData);
  return await user.save();
};

// Get user by ID
export const getUserById = async (userId: string) => {
  return await User.findOne({ userId });
};

// Update user
export const updateUser = async (userId: string, updateData: Partial<IUser>) => {
  return await User.findOneAndUpdate({ userId }, updateData, { new: true });
};

// Delete user
export const deleteUser = async (userId: string) => {
  return await User.findOneAndDelete({ userId });
};

// Get user's completed lessons
export const getUserCompletedLessons = async (userId: string) => {
  const user = await User.findOne({ userId }).select('completedLessons');
  return user?.completedLessons || [];
};

// Get user's quiz history
export const getUserTakenQuizzes = async (userId: string) => {
  const user = await User.findOne({ userId }).select('takenQuizzes');
  return user?.takenQuizzes || [];
};
