import User from '../models/user'; // Modelo de usuario
import { IUser } from '../interfaces/user.interface'; // Interfaz de usuario
import bcrypt from 'bcrypt';

class UserService {
  // Crear un nuevo usuario
  public static async createUser(userData: IUser): Promise<IUser> {
    try {
      const { name, dni, email, password_hash, role, status, profile_picture } =
        userData;

      // Aplicar hash a la contraseña antes de guardarla
      const hashedPassword = await bcrypt.hash(password_hash, 10);

      const newUser = await User.create({
        name,
        dni,
        email,
        password_hash: hashedPassword, // Guardar la contraseña encriptada
        role,
        status,
        profile_picture,
      });

      return newUser.toJSON();
    } catch (error: any) {
      console.error('Error al crear el usuario:', error.message);
      throw new Error('Error al crear el usuario: ' + error.message);
    }
  }


  // Actualizar un usuario
    public static async updateUser(id: number, userData: Partial<IUser>): Promise<IUser | null> {
      try {
        // Validar que el ID sea un número válido
        if (isNaN(id) || id <= 0) {
          throw new Error('ID inválido. Debe ser un número positivo.');
        }
  
        const user = await User.findByPk(id);
        
        if (!user) {
          return null;
        }
  
        // Si se actualiza la contraseña, aplicar hash
        if (userData.password_hash) {
          userData.password_hash = await bcrypt.hash(userData.password_hash, 10);
        }
  
        await user.update(userData);
        return user.toJSON();
      } catch (error: any) {
        console.error('Error al actualizar el usuario:', error.message);
        throw new Error('Error al actualizar el usuario: ' + error.message);
      }
    }
  

  // Obtener un usuario por ID
  public static async getUserById(id: number): Promise<IUser | null> {
    try {
      // Validar que el ID sea un número válido
      if (isNaN(id) || id <= 0) {
        throw new Error('ID inválido. Debe ser un número positivo.');
      }

      const user = await User.findByPk(id);
      return user ? user.toJSON() : null;
    } catch (error: any) {
      console.error('Error al obtener el usuario:', error.message);
      throw new Error('Error al obtener el usuario: ' + error.message);
    }
  }

  // Verificar la contraseña del usuario
  public static async verifyPassword(
    inputPassword: string,
    storedPassword: string
  ): Promise<boolean> {
    try {
      return await bcrypt.compare(inputPassword, storedPassword);
    } catch (error: any) {
      console.error('Error al verificar la contraseña:', error.message);
      throw new Error('Error al verificar la contraseña: ' + error.message);
    }
  }

  // Eliminar un usuario por ID
    public static async deleteUser(id: number): Promise<boolean> {
      try {
        // Validar que el ID sea un número válido
        if (isNaN(id) || id <= 0) {
          throw new Error('ID inválido. Debe ser un número positivo.');
        }
  
        const user = await User.findByPk(id);
        
        if (!user) {
          return false;
        }
  
        await user.destroy();
        return true;
      } catch (error: any) {
        console.error('Error al eliminar el usuario:', error.message);
        throw new Error('Error al eliminar el usuario: ' + error.message);
      }
    }
  

  // Obtener todos los usuarios
  public static async getAllUsers(): Promise<IUser[]> {
    try {
      const users = await User.findAll();
      return users.map((user) => user.toJSON());
    } catch (error: any) {
      console.error('Error al obtener los usuarios:', error.message);
      throw new Error('Error al obtener los usuarios: ' + error.message);
    }
  }
}

export default UserService;
