create database asturdron;

use asturdron;

CREATE TABLE users (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    password VARCHAR(100),
    license ENUM('a1', 'a2', 'a3', 'any'),
    user_email VARCHAR(100),
    score INT
);

CREATE TABLE announcements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100),
    content TEXT,
    created_at DATETIME,
    updated_at DATETIME,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(ID)
        ON UPDATE RESTRICT
        ON DELETE CASCADE
);

CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    content TEXT,
    created_at DATETIME(6),
    updated_at DATETIME(6),
    announcement_id INT,
    user_id BIGINT,
    FOREIGN KEY (announcement_id) REFERENCES announcements(id)
        ON UPDATE RESTRICT
        ON DELETE RESTRICT,
    FOREIGN KEY (user_id) REFERENCES users(ID)
        ON UPDATE RESTRICT
        ON DELETE RESTRICT
);

CREATE TABLE images (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    image MEDIUMTEXT,
    username VARCHAR(50),
    score INT,
    FOREIGN KEY (username) REFERENCES users(username)
        ON UPDATE RESTRICT
        ON DELETE RESTRICT
);

CREATE TABLE notices (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    miniature VARCHAR(255),
    titular VARCHAR(255),
    notice TEXT,
    license ENUM('a1', 'a2', 'a3', 'any'),
    user_id INT,
    date_year VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(ID)
        ON UPDATE RESTRICT
        ON DELETE RESTRICT
);

CREATE TABLE videos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    miniature MEDIUMTEXT,
    video MEDIUMTEXT,
    username VARCHAR(50),
    score INT,
    FOREIGN KEY (username) REFERENCES users(username)
        ON UPDATE RESTRICT
        ON DELETE CASCADE
);

CREATE TABLE weather (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    week_day VARCHAR(15),
    number_day INT,
    weather VARCHAR(50)
);

CREATE TABLE announcements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    user_id INT NOT NULL,
    
    CONSTRAINT fk_announcements_user 
        FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_announcements_created_at ON announcements(created_at);
CREATE INDEX idx_announcements_user_id ON announcements(user_id);


INSERT INTO users (ID, username, password, license, user_email, score) VALUES
(1, 'admin', 'admin', 'a1', 'admin@aesa.es', 99),
(2, 'carlos', 'passcarlos', 'a1', 'carlos.martin@aesa.es', 67),
(3, 'laura', 'passlaura', 'a2', 'laura.gomez@aesa.es', 74),
(4, 'diego', 'passdiego', 'a2', 'diego.ruiz@aesa.es', 81),
(5, 'marta', 'passmarta', 'a3', 'marta.lopez@aesa.es', 69),
(6, 'alvaro', 'passalvaro', 'a3', 'alvaro.sanchez@aesa.es', 72);

INSERT INTO notices (miniature, titular, notice, license, user_id, date_year) VALUES
-- LICENCIA A1
('', 'Curso piloto A1/A3 – matrícula abierta', 
 'Curso de formación y examen de piloto a distancia en categoría abierta, subcategorías A1/A3 – Última modificación: 6 Noviembre 2024.', 
 'a1', 1, '2024'),
('', 'Formación gratuita A1/A3', 
 'Formación online gratuita de AESA para piloto a distancia A1/A3, necesaria para volar drones clase C0 y C1.', 
 'a1', 2, '2024'),
('', 'Normativa actualizada para A1', 
 'La normativa para drones en categoría A1 ha sido actualizada. Se recomienda revisar el asistente virtual de AESA.', 
 'a1', 1, '2025'),
('', 'Avisos sobre batería baja en A1', 
 'Implementación de alertas automáticas de batería baja obligatoria en drones categoría A1.', 
 'a1', 2, '2025'),

-- LICENCIA A2
('', 'Examen A2 disponible para pilotos', 
 'Ya está disponible el examen de piloto a distancia A2 con evaluación teórica presencial o telemática.', 
 'a2', 3, '2025'),
('', 'Prácticas requeridas para A2', 
 'Los pilotos deben realizar prácticas autodidactas en campo abierto como parte de su certificación A2.', 
 'a2', 4, '2025'),
('', 'Actualización normativa para A2', 
 'Cambios en la legislación A2 según el Real Decreto 517/2024. Revisar documentación oficial.', 
 'a2', 3, '2025'),
('', 'Batería baja y seguridad A2', 
 'Se recomienda instalar sistemas de aviso de batería en vuelos A2 para mayor seguridad operativa.', 
 'a2', 4, '2025'),

-- LICENCIA A3
('', 'Formación gratuita para A1/A3', 
 'Disponible curso gratuito para obtener certificación de piloto A3. Accesible desde la web oficial de AESA.', 
 'a3', 5, '2024'),
('', 'Actualización legal subcategoría A3', 
 'Nuevas restricciones para zonas de vuelo A3. Consultar mapa de zonas geográficas restringidas.', 
 'a3', 6, '2025'),
('', 'Curso intensivo A3', 
 'AESA ofrece curso intensivo para pilotos con licencia A3 en colaboración con academias registradas.', 
 'a3', 5, '2025'),
('', 'Precaución con clima en vuelos A3', 
 'Se recuerda a los operadores A3 la importancia de planificar según previsiones meteorológicas.', 
 'a3', 6, '2025');

INSERT INTO images (image, username, score) VALUES
-- Subidas por el admin
('https://cdn.pixabay.com/photo/2019/11/06/05/15/drone-4605203_1280.jpg', 'admin', 0),
('https://cdn.pixabay.com/photo/2016/11/19/13/59/cliff-1839392_640.jpg', 'admin', 0),

-- Subidas por otros usuarios
('https://cdn.pixabay.com/photo/2023/10/10/07/59/lake-8305673_640.jpg', 'carlos', 0),
('https://cdn.pixabay.com/photo/2017/09/16/16/08/lake-2755907_640.jpg', 'marta', 0);

INSERT INTO videos (miniature, video, username, score) VALUES
-- Subidos por el admin
('https://cdn.pixabay.com/photo/2016/11/29/09/29/beach-1868716_640.jpg', 'https://cdn.pixabay.com/video/2025/05/01/275983_tiny.mp4', 'admin', 0),
('https://cdn.pixabay.com/photo/2019/10/04/23/12/italy-4526692_640.jpg', 'https://cdn.pixabay.com/video/2025/04/29/275593_tiny.mp4', 'admin', 0),

-- Subidos por otros usuarios
('https://cdn.pixabay.com/photo/2016/11/29/08/51/forest-1868529_640.jpg', 'https://cdn.pixabay.com/video/2024/10/20/237279_tiny.mp4', 'laura', 0),
('https://cdn.pixabay.com/photo/2018/06/25/00/51/sunrise-3495775_640.jpg', 'https://cdn.pixabay.com/video/2024/06/10/216058_tiny.mp4', 'alvaro', 0);

INSERT INTO weather (id, week_day, number_day, weather) VALUES
(1, 'Sunday', 1, 'windy'),
(2, 'Monday', 2, 'sunny'),
(3, 'Tuesday', 3, 'stormy'),
(4, 'Wednesday', 4, 'cloudy'),
(5, 'Thursday', 5, 'rainy'),
(6, 'Friday', 6, 'windy'),
(7, 'Saturday', 7, 'cloudy'),
(8, 'Sunday', 8, 'windy'),
(9, 'Monday', 9, 'stormy'),
(10, 'Tuesday', 10, 'rainy'),
(11, 'Wednesday', 11, 'sunny'),
(12, 'Thursday', 12, 'cloudy'),
(13, 'Friday', 13, 'rainy'),
(14, 'Saturday', 14, 'sunny'),
(15, 'Sunday', 15, 'windy'),
(16, 'Monday', 16, 'cloudy'),
(17, 'Tuesday', 17, 'stormy'),
(18, 'Wednesday', 18, 'windy'),
(19, 'Thursday', 19, 'sunny'),
(20, 'Friday', 20, 'rainy'),
(21, 'Saturday', 21, 'cloudy'),
(22, 'Sunday', 22, 'sunny'),
(23, 'Monday', 23, 'windy'),
(24, 'Tuesday', 24, 'rainy'),
(25, 'Wednesday', 25, 'stormy'),
(26, 'Thursday', 26, 'sunny'),
(27, 'Friday', 27, 'cloudy'),
(28, 'Saturday', 28, 'rainy'),
(29, 'Sunday', 29, 'windy'),
(30, 'Monday', 30, 'sunny');
