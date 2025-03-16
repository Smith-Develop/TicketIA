import { Request, Response } from 'express';
import  User  from '../models/user';

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, dni, email, password } = req.body;
    const newUser = await User.create({ name, dni, email, password });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = user.generateToken();
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
};