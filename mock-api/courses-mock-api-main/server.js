const jsonServer = require('json-server');
const path = require('path');
const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

const PORT = 3005;

server.use(middlewares);

// Custom route: GET /categories/:category/courses
server.get('/categories/:category/courses', (req, res) => {
  const db = router.db;
  const category = req.params.category;
  const courses = db.get('courses').filter({ category: category }).value();
  res.json(courses);
});

server.use(router);

server.listen(PORT, () => {
  console.log(`🚀 Mock API Server is running on http://localhost:${PORT}`);
  console.log(`📚 Courses: http://localhost:${PORT}/courses`);
  console.log(`📂 Categories: http://localhost:${PORT}/categories`);
  console.log(`🔍 Course by ID: http://localhost:${PORT}/courses/1`);
  console.log(`📁 Courses by Category: http://localhost:${PORT}/categories/Programming/courses`);
});
