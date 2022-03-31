var nodemailer = require('nodemailer');
var amqp = require('amqplib/callback_api');


var from = 'dhanushsridhar2@gmail.com'

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: from,
    pass: '9962070059'
  }
});

amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        var queue = 'mail';

        channel.assertQueue(queue, {
            durable: true
        });

        console.log(" [*] Waiting for messages to %s. To exit press CTRL+C", queue);

        channel.consume(queue, function(msg) {
            var m = msg.content.toString()
            console.log(" [x] Received %s", m);
            var m1 = JSON.parse(m);

            var mailOptions = {
                from: from,
                to: m1.to,
                subject: m1.subject,
                text: m1.text
              };
              
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });



        }, {
            noAck: true
        });
    });
});



