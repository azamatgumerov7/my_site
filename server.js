// 1. Подключаем необходимые библиотеки и файлы
const express = require('express');
const { query } = require('./database.js');

const app = express();
const port = process.env.PORT || 3000;


// 2. Настраиваем Express
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


// 🔥 3. Создаем таблицу users (если её нет)
async function initDatabase() {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) NOT NULL,
        email VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('Таблица users готова');
  } catch (error) {
    console.error('Ошибка создания таблицы:', error.message);
  }
}


// 4. Главная страница
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});


// 5. Регистрация
app.post('/register', async (req, res) => {
  const { username, email } = req.body;

  try {
    await query(
      'INSERT INTO users (username, email) VALUES ($1, $2)',
      [username, email]
    );

    res.send('Регистрация успешна!');
  } catch (error) {
    res.send('Ошибка: ' + error.message);
  }
});


// 6. Получить всех пользователей
app.get('/users', async (req, res) => {
  try {
    const users = await query('SELECT * FROM users');
    res.json(users);
  } catch (error) {
    res.send('Ошибка: ' + error.message);
  }
});


// 🔥 7. Запуск сервера (сначала создаем таблицу)
initDatabase().then(() => {
  app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
  });
});
