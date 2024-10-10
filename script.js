const express = require('express');
const multer = require('multer');
const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

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

// Настройка Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'File Exchange API',
            version: '1.0.0',
            description: 'API для обмена файлами',
        },
    },
    apis: ['./index.js'], // Укажите путь к файлу с маршрутами
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Загрузка файла
 *     description: Загрузка файла на сервер.
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Файл успешно загружен
 *       400:
 *         description: Ошибка загрузки
 */
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('Ошибка загрузки файла');
    }
    res.send(`Файл загружен: /uploads/${req.file.filename}`);
});

/**
 * @swagger
 * /download/{filename}:
 *   get:
 *     summary: Скачивание файла
 *     description: Скачивание файла по его имени.
 *     parameters:
 *       - in: path
 *         name: filename
 *         schema:
 *           type: string
 *         required: true
 *         description: Имя файла для скачивания
 *     responses:
 *       200:
 *         description: Файл успешно скачан
 *       404:
 *         description: Файл не найден
 */
app.get('/download/:filename', (req, res) => {
    const file = `${__dirname}/uploads/${req.params.filename}`;
    res.download(file, (err) => {
        if (err) {
            return res.status(404).send('Файл не найден');
        }
    });
});

app.listen(3000, () => {
    console.log('Сервер запущен на http://localhost:3000');
    console.log('Swagger документация доступна на http://localhost:3000/api-docs');
});