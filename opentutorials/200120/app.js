const express = require('express');
const app = express();

// jade 렌더링된 페이지 소스 이쁘게
if (app.get('env') === 'development')
    app.locals.pretty = true;

app.set('view engine', 'jade');
app.set('views', './views');    // 생략해도 기본적으로 찾음
app.use(express.static('public'));
app.get('/template', (req, res) => {
    res.render('temp', {time: Date(), title:'Jade'}); // temp 페이지를 렌더링
})

// home 으로 GET 방식으로 접속했을 때 콜백
app.get('/', (req, res) => {
    res.send('<h1 style="color:#ccc;">Hello home page!</h1><p>My name is 이승준</p>');
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

app.listen(3000, () => {
    console.log('Connected 3000 port!');
});