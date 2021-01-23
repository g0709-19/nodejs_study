const express = require('express');
const app = express();
const PORT = 3000;

// File
const fs = require('fs');

// body parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

// jade 렌더링된 페이지 소스 이쁘게
if (app.get('env') === 'development')
    app.locals.pretty = true;

app.set('view engine', 'jade');
app.set('views', './views');
app.use(express.static('public'));

app.get('', (req, res) => {
    res.send('<h1>안녕</h1>');
});

// app.get('/topic/new', (req, res) => {
//     
// });

app.get(['/topic', '/topic/:id'], (req, res) => {
    fs.readdir('data/', (err, files) => {
        if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
        } else {
            const id = req.params.id;
            if (id) {
                if (id === "new")
                    res.render('new', { files });
                else {
                    fs.readdir('data/', (err, files) => {
                        if (err) {
                            console.log(err);
                            res.status(500).send('Internal Server Error');
                        } else {
                            fs.readFile('data/' + id, (err, data) => {
                                if (err) {
                                    console.log(err);
                                    res.status(500).send('Internal Server Error');
                                } else {
                                    res.render('view', { files, title: id, description: data });
                                }
                            });
                        }
                    });
                }
            } else {
                res.render('view', { files, title: 'Welcome', description: 'Hello, JavaScript for server.' });
            }
        }
    });
});

app.post('/topic', (req, res) => {
    const title = req.body.title;
    const description = req.body.description;
    fs.writeFile('data/' + title, description, err => {
        if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
        } else {
            res.redirect('/topic/' + title);
        }
    });
})

app.listen(PORT, () => {
    console.log(`${PORT}번 포트로 서버가 열렸습니다.`);
})