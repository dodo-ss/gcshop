const express = require('express');
const app = express();
const session = require('express-session');
const MySqlStore = require('express-mysql-session')(session);
const db = require('./lib/db');
const options = {
    host: 'localhost',
    user: 'root',
    password: '741ASD741ASD',
    database: 'webdb2026'
};
const sessionStore = new MySqlStore(options);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    }
}));

app.use((req, res, next) => {
    const sql = `SELECT * FROM code;`; 
    
    db.query(sql, (error, results) => {
        if (error) {
            console.error("사이드바 카테고리 조회 에러: ", error);
            return next(); 
        }
        res.locals.categories = results; 
        next(); 
    });
});

const rootRouter = require('./router/rootRouter');
const authRouter = require('./router/authRouter');
const codeRouter = require('./router/codeRouter');
const personRouter = require('./router/personRouter');
const productRouter = require('./router/productRouter');
const boardtypeRouter = require('./router/boardtypeRouter');

app.use('/', rootRouter);
app.use('/auth', authRouter);
app.use('/code', codeRouter);
app.use('/person', personRouter);
app.use('/product', productRouter);
app.use('/boardtype', boardtypeRouter);

app.get('/favicon.ico', (req, res) => res.writeHead(404));
app.listen(3000, () => console.log('Example app listening on port 3000'));