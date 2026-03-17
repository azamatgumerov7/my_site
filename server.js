// 1. Подключаем необходимые библиотеки и файлы
const express = require('express');  // Подключаем Express (каркас сервера)
const { query } = require('./database.js'); // Подключаем нашу функцию query из database.js
const app = express();  // Создаем приложение Express
const port = process.env.PORT || 3000;      // Порт, на котором будет работать сайт

// 2. Настраиваем Express
app.use(express.urlencoded({ extended: true })); // Позволяет читать данные из форм
app.use(express.static('public')); // Говорим: "Раздавай файлы из папки 'public'"

// 3. Создаем главный маршрут (роут)
// Когда пользователь заходит на главную страницу...
app.get('/', (req, res) => {
  // ...мы отправляем ему файл index.html
  res.sendFile(__dirname + '/public/index.html');
});

// 4. Создаем маршрут для регистрации
// Когда форма отправляет данные на /register...
app.post('/register', async (req, res) => {
  // Берем данные из формы (name="username" и name="email")
  const { username, email } = req.body;
  
  try {
    // Отправляем SQL-запрос в базу данных
    // $1 и $2 — это защита от взлома (параметризованный запрос)
    await query(
      'INSERT INTO users (username, email) VALUES ($1, $2)',
      [username, email]  // $1 = username, $2 = email
    );
    res.send('Регистрация успешна!'); // Отправляем ответ пользователю
  } catch (error) {
    res.send('Ошибка: ' + error.message); // Если ошибка — сообщаем
  }
});

// 5. Создаем маршрут для получения всех пользователей
app.get('/users', async (req, res) => {
  const users = await query('SELECT * FROM users'); // Берем всех пользователей из БД
  res.json(users); // Отправляем данные в формате JSON
});

// 6. Запускаем сервер
app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});
