const express = require('express'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    app = express(),
    db = require('./dbconnection');
    redis = require('./redisConnection')

const fileupload = require("express-fileupload");

app.use(fileupload());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('common'));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    // res.header('Access-Control-Allow-Origin', 'https://ostproduct.com/');
    // res.header('Access-Control-Allow-Origin', 'http://350044-cq02541.tmweb.ru/');
    res.header('Access-Control-Allow-Methods', 'GET, POST');
    res.header('Access-Control-Allow-Private-Network')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});


(async () => {
	// await redis.connect()
    await db.authenticate()
    .then(() => console.log('Database connected!!!'))
    .catch(err => console.log('Error:' + err));
})();



db.authenticate()
    .then(() => console.log('Database connected!!!'))
    .catch(err => console.log('Error:' + err));

// db.sync({alter: true});
// db.sync({force:true});

app.use('/api', require('./api'));

// for ost app.listen(3000,'localhost', () => console.log('Server has been started...'));
app.listen(3000, 'localhost', () => console.log('Server has been started...'));