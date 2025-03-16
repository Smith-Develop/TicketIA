import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

class User extends Model {
  public id!: number;
  public name!: string;
  public dni!: string;
  public email!: string;
  public password!: string;
  public role!: 'Usuario' | 'Técnico' | 'Administrador';
  public status!: 'Habilitado' | 'Deshabilitado';

  public async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  public generateToken(): string {
    return jwt.sign({ id: this.id, role: this.role }, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    });
  }
}

User.init(
  {
    name: DataTypes.STRING,
    dni: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.ENUM('Usuario', 'Técnico', 'Administrador'),
    status: DataTypes.ENUM('Habilitado', 'Deshabilitado'),
  },
  {
    sequelize,
    modelName: 'User',
  }
);

export default User;