INSERT INTO authors (name, email, bio) VALUES
('Gerardo Acosta', 'gerardo@example.com', 'Desarrollador backend en formación'),
('Lucía Fernández', 'lucia@example.com', 'Entusiasta de las bases de datos'),
('Tomás Rivero', 'tomas@example.com', 'Fan de Node.js y el café');

INSERT INTO posts (author_id, title, content, published) VALUES
(1, 'Mi aventura con Express', 'Aprender Express fue más fácil de lo que pensaba', true),
(1, 'Por qué me gusta PostgreSQL', 'Las bases de datos relacionales tienen mucho sentido', false),
(2, 'Consultas SQL desde cero', 'Empecé sin saber nada y acá estoy', true),
(3, 'Node.js en la práctica', 'Construir una API REST te enseña un montón', true);