const db = require('./db');

function authIsOwner(req) {
    return {
        name: req.session.name || 'Guest',
        login: req.session.is_logined || false,
        cls: req.session.cls || 'NON'
    };
}

module.exports = {
    view: (req, res) => {
        const { name, login, cls } = authIsOwner(req);
        db.query('SELECT * FROM code', (error, results) => {
            const context = { who: name, login, cls, body: 'code.ejs', results };
            res.render('mainFrame', context);
        });
    },
    create: (req, res) => {
        const { name, login, cls } = authIsOwner(req);
        const context = { who: name, login, cls, body: 'codeCU.ejs', mode: 'create' };
        res.render('mainFrame', context);
    },
    create_process: (req, res) => {
        const b = req.body;
        db.query('INSERT INTO code VALUES(?,?,?,?,?,?)', 
        [b.main_id, b.sub_id, b.main_name, b.sub_name, b.start, b.end], (error) => {
            res.redirect('/code/view');
        });
    },

    update: (req, res) => {
        const { name, login, cls } = authIsOwner(req);
        const context = { who: name, login, cls, body: 'codeCU.ejs', mode: 'create' };
        res.render('mainFrame', context);
    },
    update_process: (req, res) => {
        const b = req.body;
        db.query('INSERT INTO code VALUES(?,?,?,?,?,?)', 
        [b.main_id, b.sub_id, b.main_name, b.sub_name, b.start, b.end], (error) => {
            res.redirect('/code/view');
        });
    },

    delete: (req, res) => {
        const { name, login, cls } = authIsOwner(req);
        const context = { who: name, login, cls, body: 'codeCU.ejs', mode: 'create' };
        res.render('mainFrame', context);
    },
    delete_process: (req, res) => {
        const b = req.body;
        db.query('INSERT INTO code VALUES(?,?,?,?,?,?)', 
        [b.main_id, b.sub_id, b.main_name, b.sub_name, b.start, b.end], (error) => {
            res.redirect('/code/view');
        });
    }
};