const express = require('express');
const bodyParser = require('body-parser');
const jwtToken = require('jsonwebtoken');
const exjwt = require('express-jwt');
const expressJwt = require('express-jwt');


const app = express();
const path = require('path');
const port = 3000;
const secretKey = 'My super';

const jwtMW = expressJwt({
    secret: secretKey,
    algorithms: ['HS256']
});



const users = [
    {
        id: 1,
        username: 'admin',
        password: 'admin'
    },
    {
        id: 2,
        username: 'umang',
        password: '1234'
    },
    {
        id: 3,
        username: 'patel',
        password: '1234'
    }];

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Headers', 'Content-type,Authorization');
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});


app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});


app.get('/settings', (req, res) => {    
    res.sendFile(path.join(__dirname, 'settings.html'));
});


app.get('/api/dashboard', jwtMW, (req, res) => {
    jwtToken.verify(req.token, secretKey, (err, decoded) => {
        if (err) {
            res.status(401).json({
                success: false,
                officialError: err,
                err: 'Username or password is incorrect 2'
            });
        }
        else {
            res.json({
                success: true,
                myContent: 'Secret content that only logged in people can see!!!'
            });
        }
    });
});



app.get('/api/prices', jwtMW, (req, res) => {
    jwtToken.verify(req.token, secretKey, (err, decoded) => {
        if (err) {
            res.status(401).json({
                success: false,
                officialError: err,
                err: 'Username or password is incorrect 2'
            });
        } else {
            res.json({
                success: true,
                myContent: 'This is the price $500'
            });
        }
    });
});



app.get('/api/settings', jwtMW, (req, res) => {
    jwtToken.verify(req.token, secretKey, (err, decoded) => {
        if (err) {
            res.status(401).json({
                success: false,
                officialError: err,
                err: 'Username or password is incorrect 2'
            });
        }
        else {
            res.json({
                success: true,
                myContent: 'This is the settings page. It is only visible to logged in Users.'
            });
        }
    });
});




app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    for (let user of users) {
        if (username === user.username && password === user.password) {
            let token = jwtToken.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: '3m'});
            res.json({
                success: true,
                err: null,
                token: token,
                username: user.username
            });

            break;
        }
        else {
            res.status(401).json({
                success: false,
                token: null,
                err: 'Username or password is incorrect'
            });
            return;
        }
    }
});


app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({
            success: false,
            officialError: err,
            err: 'Username or password is incorrect 2'
        });
        return;
    }
    else {
        next(err);
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
