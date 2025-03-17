import app from './app';
import sequelize from './config/db';


const PORT = process.env.PORT || 3000;

//sincronizar base de datos y levantar servidor
sequelize.sync()
  .then(() => {
    console.log('✅ Base de datos sincronizada correctamente.');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Error al sincronizar la base de datos:', error);
  });
