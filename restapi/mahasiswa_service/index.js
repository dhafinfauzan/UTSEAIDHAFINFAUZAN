// index.js
const express = require('express');
const bodyParser = require('body-parser');
const amqp = require('amqplib/callback_api');

const app = express();
const PORT = 4000;

app.use(bodyParser.json());

// Konfigurasi RabbitMQ
const rabbitMQUrl = 'amqp://rabbitmq';
const queueName = 'pesan_dosen';

// Membuat koneksi ke RabbitMQ
amqp.connect(rabbitMQUrl, (error0, connection) => {
    if (error0) {
        throw error0;
    }
    // Membuat channel
    connection.createChannel((error1, channel) => {
        if (error1) {
            throw error1;
        }
        // Menetapkan antrian untuk mengonsumsi pesan
        channel.assertQueue(queueName, {
            durable: false
        });
        // Mengonsumsi pesan dari antrian
        channel.consume(queueName, (message) => {
            console.log(" [x] Received %s", message.content.toString());
        }, {
            noAck: true
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
