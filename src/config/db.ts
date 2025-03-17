import { Sequelize } from 'sequelize';
import  dotenv from 'dotenv';

// Configurar dotenv
dotenv.config();

// Configuración de la conexión
const sequelize = new Sequelize(
  process.env.DB_NAME!, // Nombre de la base de datos
  process.env.DB_USER!, // Usuario de la base de datos
  process.env.DB_PASSWORD!, // Contraseña del usuario
  
  {
    host: process.env.DB_HOST, // Host de la base de datos (por ejemplo, 'localhost')
    dialect: 'mysql', // O 'postgres' si usas PostgreSQL
    logging: false, // Desactiva los logs de SQL en la consola (opcional)
    pool: {
      max: 12, // Número máximo de conexiones en el pool
      min: 0, // Número mínimo de conexiones en el pool
      acquire: 30000, // Tiempo máximo para obtener una conexión
      idle: 10000, // Tiempo máximo que una conexión puede estar inactiva
    },
  }
);

// Probar la conexión
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente.');
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:', error);
  }
}

testConnection();

export default sequelize;