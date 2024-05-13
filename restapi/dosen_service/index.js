// index.js
const express = require('express');
const bodyParser = require('body-parser');
const amqp = require('amqplib/callback_api');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Endpoint untuk mengirim pesan dari dosen
app.post('/send_message', (req, res) => {
    const message = req.body.message;
    publishMessage(message);
    res.json({ status: 'success', message: 'Message sent successfully!' });
});

// Fungsi untuk mengirim pesan ke RabbitMQ
function publishMessage(message) {
    amqp.connect('amqp://rabbitmq', (error0, connection) => {
        if (error0) {
            throw error0;
        }
        connection.createChannel((error1, channel) => {
            if (error1) {
                throw error1;
            }
            const queue = 'pesan_dosen';
            channel.assertQueue(queue, {
                durable: false
            });
            channel.sendToQueue(queue, Buffer.from(message));
            console.log(" [x] Sent %s", message);
        });
        setTimeout(() => {
            connection.close();
        }, 500);
    });
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
