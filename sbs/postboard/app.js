const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql      = require('mysql');
const db_config  = require('./config/db-config.json');

app.locals.moment = require('moment');

const connection = mysql.createConnection({
  host     : db_config.host,
  user     : db_config.user,
  password : db_config.password,
  database : db_config.database
});

connection.connect();

const PORT = 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'jade');
app.set('views', './views');

// jade 렌더링된 페이지 소스 이쁘게
if (app.get('env') === 'development')
app.locals.pretty = true;

app.get('', (req, res) => {
    const sql = 'SELECT * from posts';
    connection.query(sql, (error, rows, fields) => {
        if (error) throw error;
        res.render('home', {posts:rows});
    });
});

app.get(['/post/:id', '/post/:id/:pkey'], (req, res) => {
    const id = req.params.id;
    const pkey = req.params.pkey;
    if (id) {
        switch(id) {
            case 'new':
                res.render('new', {mode:'new'});
                break;
            case 'delete':
                if (pkey) {
                    const sql = `DELETE from posts where id=${pkey};`;
                    connection.query(sql, (error, rows, fields) => {
                        if (error) throw error;
                        res.redirect('/');
                    });
                }
                break;
            case 'edit':
                {
                    const sql = `SELECT * from posts where id=${pkey};`;
                    connection.query(sql, (error, rows, fields) => {
                        if (error) throw error;
                        if (pkey) {
                            res.render('new', {mode:'edit',id:pkey,post:rows[0]});
                        }
                    });
                }
                break;
            default:
                {
                    const sql = `SELECT * from posts where id=${id};`;
                    connection.query(sql, (error, rows, fields) => {
                        if (error) throw error;
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
    let sql;
    if (id) {
        switch (id) {
        case 'new':
            sql = `INSERT into posts (title, description, date) values('${title}', '${desc}', CURDATE());`;
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
        connection.query(sql, (error, rows, fields) => {
            if (error) {
                console.log(error);
                res.status(500).send('Internal server error!');
            }
            res.redirect('/');
        });
    }
});

app.listen(PORT, () => {
    console.log("열렸다");
});