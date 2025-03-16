-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS cau_db;
USE cau_db;

-- Tabla de Usuarios
-- Almacena la información de los usuarios del sistema, incluyendo su rol y estado.
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,              -- Nombre del usuario
    dni VARCHAR(20) UNIQUE NOT NULL,         -- DNI del usuario (único)
    email VARCHAR(100) UNIQUE NOT NULL,      -- Correo electrónico (único)
    password_hash VARCHAR(255) NOT NULL,     -- Contraseña hasheada
    role ENUM('Usuario', 'Técnico', 'Administrador') NOT NULL, -- Rol del usuario
    status ENUM('Habilitado', 'Deshabilitado') NOT NULL DEFAULT 'Habilitado', -- Estado del usuario
    profile_picture VARCHAR(255),            -- URL de la foto de perfil (almacenada en Cloudinary)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha de creación del usuario
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Fecha de última actualización
);

-- Tabla de Turnos
-- Almacena los turnos reservados por los usuarios.
CREATE TABLE IF NOT EXISTS turns (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,                    -- ID del usuario que reservó el turno
    date_time DATETIME NOT NULL,              -- Fecha y hora del turno
    status ENUM('Reservado', 'Confirmado', 'Cancelado') NOT NULL DEFAULT 'Reservado', -- Estado del turno
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha de creación del turno
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Fecha de última actualización
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE -- Relación con la tabla de usuarios
);

-- Tabla de Servicios
-- Almacena los servicios ofrecidos por el CAU.
CREATE TABLE IF NOT EXISTS services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,              -- Nombre del servicio
    description TEXT,                        -- Descripción del servicio
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha de creación del servicio
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Fecha de última actualización
);

-- Tabla de Tickets
-- Almacena las incidencias y solicitudes creadas por los usuarios.
CREATE TABLE IF NOT EXISTS tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,                    -- ID del usuario que creó el ticket
    technician_id INT,                       -- ID del técnico asignado (puede ser nulo inicialmente)
    service_id INT NOT NULL,                 -- ID del servicio relacionado
    type ENUM('Incidencia', 'Solicitud') NOT NULL, -- Tipo de ticket
    description TEXT NOT NULL,               -- Descripción del ticket
    status ENUM('Registrado', 'Asignado', 'Pendiente de usuario', 'Cancelado', 'Cerrado', 'Resuelto') NOT NULL DEFAULT 'Registrado', -- Estado del ticket
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha de creación del ticket
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Fecha de última actualización
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE, -- Relación con la tabla de usuarios
    FOREIGN KEY (technician_id) REFERENCES users(id) ON DELETE SET NULL, -- Relación con la tabla de usuarios (técnicos)
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE -- Relación con la tabla de servicios
);

-- Tabla de Comentarios
-- Almacena los comentarios asociados a los tickets.
CREATE TABLE IF NOT EXISTS comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_id INT NOT NULL,                  -- ID del ticket al que pertenece el comentario
    user_id INT NOT NULL,                    -- ID del usuario que hizo el comentario
    comment TEXT NOT NULL,                   -- Contenido del comentario
    attachment_url VARCHAR(255),             -- URL del archivo adjunto (almacenado en Cloudinary)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha de creación del comentario
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE, -- Relación con la tabla de tickets
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE -- Relación con la tabla de usuarios
);

-- Tabla de Logs
-- Almacena un registro de las acciones importantes en el sistema.
CREATE TABLE IF NOT EXISTS logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(100) NOT NULL,         -- Nombre del usuario que realizó la acción
    user_dni VARCHAR(20) NOT NULL,           -- DNI del usuario que realizó la acción
    summary TEXT NOT NULL,                   -- Resumen de la acción
    current_status VARCHAR(50) NOT NULL,     -- Estado actual relacionado con la acción
    assigned_agent VARCHAR(100),             -- Nombre del agente asignado (si aplica)
    assigned_agent_dni VARCHAR(20),          -- DNI del agente asignado (si aplica)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Fecha de creación del log
);

-- Tabla de Notificaciones
-- Almacena las notificaciones enviadas a los usuarios.
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,                    -- ID del usuario que recibe la notificación
    message TEXT NOT NULL,                   -- Mensaje de la notificación
    is_read BOOLEAN DEFAULT FALSE,           -- Indica si la notificación ha sido leída
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha de creación de la notificación
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE -- Relación con la tabla de usuarios
);