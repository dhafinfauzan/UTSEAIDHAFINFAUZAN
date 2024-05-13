// publisher.js
const amqp = require('amqplib/callback_api');

const rabbitMQUrl = 'amqp://localhost';
const exchangeName = 'pesan_exchange';

amqp.connect(rabbitMQUrl, (error, connection) => {
    if (error) {
        throw error;
    }

    connection.createChannel((error1, channel) => {
        if (error1) {
            throw error1;
        }

        channel.assertExchange(exchangeName, 'fanout', {
            durable: false
        });

        setInterval(() => {
            const message = `Hallo`;
            channel.publish(exchangeName, '', Buffer.from(message));
            console.log(" [x] Sent '%s'", message);
        }, 1000);
    });
});
