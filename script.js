const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();

// Настройка хранения файлов
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)) // сохранение файла с уникальным именем
    }
});
const upload = multer({ storage: storage });

// Маршрут для загрузки файла
app.post('/upload', upload.single('file'), (req, res) => {
    res.send(`Файл загружен: /uploads/${req.file.filename}`);
});

// Маршрут для скачивания файла
app.get('/download/:filename', (req, res) => {
    const file = `${__dirname}/uploads/${req.params.filename}`;
    res.download(file); // отправляем файл на скачивание
});

app.listen(3000, () => {
    console.log('Сервер запущен на http://localhost:3000');
});