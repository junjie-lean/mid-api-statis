const express = require('express');
const _ = require('lodash');
const static = require('./router/router');
const { db } = require('./db/db-connect');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.use('/view', express.static('./view'));
app.all('*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
})
app.get('/', (req, res) => {
    db.lean();
    res.send('????');
})

app.get('/random', (req, res) => {
    let arr = ['/api/a', '/api/b', '/api/c', '/api/d', '/api/e'];

    let pushIndex = Math.floor(Math.random() * 5);
    // console.log(pushIndex);
    db.random(arr[pushIndex])
    res.send('thx visit')
})

app.get('/getdata', (req, res) => {
    let data = 100;
    let data1 = db.get('rows').value().length;
    console.log(db.get('rows').value())
    res.send(`data=${data1}`)
})


app.get('/params', (req, res) => {
    let len = db.get('rows').filter({ username: req.query.data }).size().value();
    console.log(len);
    // res.send('success')

    let resData = {};
    resData[`reqNumOf${req.query.data}`] = len;
    res.json(resData);
})

app.get('/show/all', (req, res) => {
    let data = _.countBy(db.get('rows').value(), 'username');
    // console.log
    let _data = [];
    for (let key in data) {
        if (key == 'initial') {
            continue;
        }
        
        _data.push({
            type: key,
            value: db.get('rows').filter({ username: key }).size().value()
        })
    }
    res.json({
        ..._data
    })
})

app.listen(30000, (err) => {
    if (err) {
        throw new Error(err.message);
    }
    console.log('server stat at 30000');
})
