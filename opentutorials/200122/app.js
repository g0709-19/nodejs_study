const express = require('express');
const app = express();
const bodyParser = require('body-parser');  // POST 방식 받기 위한 작업

// jade 렌더링된 페이지 소스 이쁘게
if (app.get('env') === 'development')
    app.locals.pretty = true;

app.set('view engine', 'jade');
app.set('views', './views');    // 생략해도 기본적으로 찾음
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/form', (req, res) => {
    res.render('form');
})

app.post('/form_receiver', (req, res) => {
    const title = req.body.title;
    const description = req.body.description;
    res.send(title+","+description);
})

app.get('/topic/:id', (req, res) => {
    const topics = [
        'Javascript is...'
        ,'Nodejs is...'
        ,'Express is...'
    ];
    const output = `
        <a href="/topic/0">Javascript</a><br>
        <a href="/topic/1">Nodejs</a><br>
        <a href="/topic/2">Express</a><br><br>
        ${topics[req.params.id]}
    `;
    res.send(output);
})

app.get('/topic/:id/:mode', (req, res) => {
    res.send(req.params.id+","+req.params.mode);
})

// home 으로 GET 방식으로 접속했을 때 콜백
app.get('/', (req, res) => {
    res.send('<h1 style="color:#ccc;">Hello home page!</h1>');
});

app.get('/dynamic', (req, res) => {
    let lis = '';
    const time = Date();
    for (let i=0; i<5; ++i)
        lis += '<li>coding</li>';
    const output = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        Hello, Dynamic!
        <ul>${lis}</ul>
        <p>${time}</p>
    </body>
    </html>
    `;
    res.send(output)
})

app.get('/route', (req, res) => {
    res.send('Hello Router, <img src="logo.svg">')
})

app.get('/login', (req, res) => {
    res.send('Login plz!');
});

const port = 3000;
app.listen(port, () => {
    console.log(`Connected ${port} port!`);
});