import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db'; // Importar la instancia de Sequelize
import bcrypt from 'bcrypt';

class User extends Model {
  public id!: number;
  public name!: string;
  public dni!: string;
  public email!: string;
  public password_hash!: string;
  public role!: 'Usuario' | 'Técnico' | 'Administrador';
  public status!: 'Habilitado' | 'Deshabilitado';
  public profile_picture?: string;
  public created_at!: Date;
  public updated_at!: Date;

  // Método para verificar la contraseña
  public static async verifyPassword(
    inputPassword: string,
    storedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(inputPassword, storedPassword);
  }
}

// Definir el modelo de usuario
User.init(
  {
    name: { type: DataTypes.STRING, allowNull: false },
    dni: { type: DataTypes.STRING, allowNull: false, unique: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password_hash: { type: DataTypes.STRING, allowNull: false },
    role: {
      type: DataTypes.ENUM('Usuario', 'Técnico', 'Administrador'),
      defaultValue: 'Usuario',
    },
    status: {
      type: DataTypes.ENUM('Habilitado', 'Deshabilitado'),
      defaultValue: 'Habilitado',
    },
    profile_picture: { type: DataTypes.STRING, allowNull: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    sequelize, // Instancia de sequelize
    tableName: 'users',
    modelName: 'User',
    timestamps: false, // No usar los campos createdAt/updatedAt de Sequelize
    hooks: {
      beforeCreate: async (user: User) => {
        if (user.password_hash) {
          user.password_hash = await bcrypt.hash(user.password_hash, 10); // Hash de la contraseña
        }
      },
      beforeUpdate: async (user: User) => {
        if (user.password_hash) {
          user.password_hash = await bcrypt.hash(user.password_hash, 10); // Hash de la contraseña
        }
      },
    },
  }
);

export default User;
