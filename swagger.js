const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'File Exchange API',
            version: '1.0.0',
            description: 'API для обмена файлами',
        },
    },
    apis: ['./routes/*.js'], // Укажите путь к вашим маршрутам
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerSpec };