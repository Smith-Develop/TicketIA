export interface IUser {
  id?: number;
  name: string;
  dni: string;
  email: string;
  password_hash: string;
  role: 'Usuario' | 'Técnico' | 'Administrador';
  status: 'Habilitado' | 'Deshabilitado';
  profile_picture?: string;
  created_at?: Date;
  updated_at?: Date;
}
