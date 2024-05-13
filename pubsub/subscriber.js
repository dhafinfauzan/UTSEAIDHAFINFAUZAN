// subscriber.js
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

        channel.assertQueue('', {
            exclusive: true
        }, (error2, q) => {
            if (error2) {
                throw error2;
            }

            channel.bindQueue(q.queue, exchangeName, '');

            console.log(" [*] Waiting for messages. To exit press CTRL+C");

            channel.consume(q.queue, (msg) => {
                console.log(" [x] Received %s", msg.content.toString());
            }, {
                noAck: true
            });
        });
    });
});
