INSERT INTO authors (name, email, bio) VALUES
('Gerardo Acosta', 'gerardo@example.com', 'Desarrollador backend en formacion'),
('Lucia Fernandez', 'lucia@example.com', 'Entusiasta de las bases de datos'),
('Tomas Rivero', 'tomas@example.com', 'Fan de Node.js y el cafe')
ON CONFLICT (email) DO NOTHING;

INSERT INTO posts (author_id, title, content, published)
SELECT a.id, p.title, p.content, p.published
FROM (
	VALUES
		('gerardo@example.com', 'Mi aventura con Express', 'Aprender Express fue mas facil de lo que pensaba', true),
		('gerardo@example.com', 'Por que me gusta PostgreSQL', 'Las bases de datos relacionales tienen mucho sentido', false),
		('lucia@example.com', 'Consultas SQL desde cero', 'Empece sin saber nada y aca estoy', true),
		('tomas@example.com', 'Node.js en la practica', 'Construir una API REST te ensena un monton', true)
) AS p(email, title, content, published)
JOIN authors a ON a.email = p.email
WHERE NOT EXISTS (SELECT 1 FROM posts);

INSERT INTO comments (post_id, content)
SELECT p.id, c.content
FROM (
	VALUES
		('Mi aventura con Express', 'Excelente introduccion a Express.'),
		('Mi aventura con Express', 'Me sirvio para ordenar mejor mis rutas.'),
		('Consultas SQL desde cero', 'Muy claro el enfoque paso a paso.')
) AS c(post_title, content)
JOIN posts p ON p.title = c.post_title
WHERE NOT EXISTS (SELECT 1 FROM comments);