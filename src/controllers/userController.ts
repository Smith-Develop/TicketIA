import { Request, Response } from 'express';
import UserService from '../services/userService';
import { IUser } from '../interfaces/user.interface';

class UserController {
  public static async createUser(req: Request, res: Response): Promise<void> {
    try {
      const userData: IUser = req.body;
      const newUser = await UserService.createUser(userData);
      res.status(201).json({
        message: 'Usuario creado con éxito',
        user: newUser,
      });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: 'Error al crear el usuario', error: error.message });
    }
  }


  public static async updateUser(req: Request, res: Response): Promise<void> {
      try {
        const userId = Number(req.params.id);
        const userData: Partial<IUser> = req.body;
  
        // Validar que userId sea un número válido
        if (isNaN(userId) || userId <= 0) {
          res
            .status(400)
            .json({ message: 'ID inválido, debe ser un número positivo' });
          return;
        }
  
        const existingUser = await UserService.getUserById(userId);
  
        if (!existingUser) {
          res.status(404).json({ message: 'Usuario no encontrado' });
          return;
        }
  
        const updatedUser = await UserService.updateUser(userId, userData);
  
        res.status(200).json({
          message: 'Usuario actualizado con éxito',
          user: updatedUser,
        });
      } catch (error: any) {
        res
          .status(500)
          .json({ message: 'Error al actualizar el usuario', error: error.message });
      }
    }
  

  public static async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const userId = Number(req.params.id); // Convertir a número

      // Validar que userId sea un número válido
      if (isNaN(userId) || userId <= 0) {
        res
          .status(400)
          .json({ message: 'ID inválido, debe ser un número positivo' });
        return;
      }

      const user = await UserService.getUserById(userId);

      if (!user) {
        res.status(404).json({ message: 'Usuario no encontrado' });
        return;
      }

      res.status(200).json(user);
    } catch (error: any) {
      res
        .status(500)
        .json({ message: 'Error al obtener el usuario', error: error.message });
    }
  }

  public static async verifyUserPassword(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { password } = req.body;
      const user = await UserService.getUserById(parseInt(req.params.id));

      if (!user) {
        res.status(404).json({ message: 'Usuario no encontrado' });
        return;
      }

      const isPasswordCorrect = await UserService.verifyPassword(
        password,
        user.password_hash
      );

      if (isPasswordCorrect) {
        res.status(200).json({ message: 'Contraseña correcta' });
      } else {
        res.status(400).json({ message: 'Contraseña incorrecta' });
      }
    } catch (error: any) {
      res.status(500).json({
        message: 'Error al verificar la contraseña',
        error: error.message,
      });
    }
  }

  public static async deleteUser(req: Request, res: Response): Promise<void> {
      try {
        const userId = parseInt(req.params.id);
  
        if (isNaN(userId) || userId <= 0) {
          res.status(400)
            .json({ message: 'ID inválido, debe ser un número positivo' });
          return;
        }
  
        const user = await UserService.getUserById(userId);
  
        if (!user) {
          res.status(404).json({ message: 'Usuario no encontrado' });
          return;
        }
  
        await UserService.deleteUser(userId);
        res.status(200).json({ message: 'Usuario eliminado correctamente' });
      } catch (error: any) {
        res
          .status(500)
          .json({ message: 'Error al eliminar el usuario', error: error.message });
      }
    }
  

  public static async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await UserService.getAllUsers();
      res.status(200).json(users);
    } catch (error: any) {
      res
        .status(500)
        .json({
          message: 'Error al obtener los usuarios',
          error: error.message,
        });
    }
  }
}

export default UserController;
