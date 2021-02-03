// 로그인 기능 https://url.kr/hunl9f 많이 참고함

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('./mysql-db');
const auth = require('./auth');

const cookieParser = require('cookie-parser');
const expressSession = require('express-session');

app.locals.moment = require('moment');

mysql.connect();

const PORT = 3000;

app.use(cookieParser());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressSession({
    secret: 'my key',
    resave: true,
    saveUninitialized: true
}));

app.set('view engine', 'jade');
app.set('views', './views');

// jade 렌더링된 페이지 소스 이쁘게
if (app.get('env') === 'development')
app.locals.pretty = true;

app.get('', (req, res) => {
    const sql = 'SELECT * from posts';
    mysql.query(sql, (error, rows, fields) => {
        if (error) throw error;
        res.render('home', {posts:rows, user:req.session.user});
    });
});

app.get('/logout', (req, res) => {
    req.session.user = undefined;
    res.redirect('/');
})

app.get('/register', (req, res) => {
    res.render('login', {register:true});
})

app.get('/login', (req, res) => {
    res.render('login');
})

app.post(['/login', '/register'], (req, res) => {
    const id = req.body.id;
    const pw = req.body.pw;
    switch(req.path) {
        case '/login':
            auth.login(id, pw, (err, rows) => {
                if (err) {
                    console.log(err);
                    res.status(500).send('Internal server error!');
                } else {
                    if (rows[0]) {
                        req.session.user = {
                            id, pw
                        };
                        res.redirect('/');
                    } else {
                        res.send('No user data');
                    }
                }
            });
            break;
        case '/register':
            auth.register(id, pw, (err, rows) => {
                if (err) {
                    console.log(err);
                    res.status(500).send('Internal server error!');
                } else {
                    res.redirect('/');
                }
            });
            break;
    }
})

app.get(['/post/:id', '/post/:id/:pkey'], (req, res) => {
    const id = req.params.id;
    const pkey = req.params.pkey;
    const login = req.session.user;
    if (id) {
        switch(id) {
            case 'new':
                if (login)
                    res.render('new', {mode:'new'});
                else
                    res.redirect('/login');
                break;
            case 'delete':
                if (login) {
                    if (pkey) {
                        mysql.query(`SELECT * from posts where id=${pkey} and author='${login.id}'`, (err, rows) => {
                            if (err) {
                                res.status(500).send('Internal server error!');
                            } else {
                                if (rows[0]) {
                                    const sql = `DELETE from posts where id=${pkey};`;
                                    mysql.query(sql, (error, rows, fields) => {
                                        if (error) throw error;
                                        res.redirect('/');
                                    });
                                } else {
                                    res.redirect('/');
                                }
                            }
                        })
                    }
                } else {
                    res.redirect('/login');
                }
                break;
            case 'edit':
                if (login) {
                    if (pkey) {
                        mysql.query(`SELECT * from posts where id=${pkey} and author='${login.id}'`, (err, rows) => {
                            if (err) {
                                res.status(500).send('Internal server error!');
                            } else {
                                if (rows[0]) {
                                    res.render('new', {mode:'edit',id:pkey,post:rows[0]});
                                } else {
                                    res.redirect('/');
                                }
                            }
                        })
                    }
                } else {
                    res.redirect('/login');
                }
                break;
            default:
                {
                    const sql = `SELECT * from posts where id=${id};`;
                    mysql.query(sql, (error, rows, fields) => {
                        if (error) throw error;
                        if (login)
                            res.render('post', {post:rows[0],own:(login.id === rows[0].author)});
                        else
                            res.render('post', {post:rows[0]});
                        // console.log(rows);
                    });
                }
                break;
        }
    }
});

app.post(['/post/:id', '/post/:id/:pkey'], (req, res) => {
    const title = req.body.title;
    const desc = req.body.desc;
    const id = req.params.id;
    const pkey = req.params.pkey;
    const login = req.session.user;
    if (!login)
        res.redirect('/login');
    else {
        const author = login.id;
        let sql;
        if (id) {
            switch (id) {
            case 'new':
                sql = `INSERT into posts (title, description, date, author) values('${title}', '${desc}', CURDATE(), '${author}');`;
                break;
            case 'edit':
                if (pkey) {
                    console.log(pkey);
                    sql = `UPDATE posts SET title='${title}', description='${desc}' WHERE id=${pkey};`;
                }
                break;
            default:
                res.status(500).send('모드가 이상해요.');
            }
            mysql.query(sql, (error, rows, fields) => {
                if (error) {
                    console.log(error);
                    res.status(500).send('Internal server error!');
                }
                res.redirect('/');
            });
        }
    }
});

app.listen(PORT, () => {
    console.log("열렸다");
});