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
        if (cls !== 'MNG') {
            return res.send('<script>alert("권한이 없습니다."); location.href="/";</script>');
        }
        db.query('SELECT * FROM person', (error, results) => {
            if (error) throw error;
            const context = { who: name, login, cls, body: 'person.ejs', results };
            res.render('mainFrame', context);
        });
    },

    create: (req, res) => {
        const { name, login, cls } = authIsOwner(req);
        const context = { who: name, login, cls, body: 'personCU.ejs', mode: 'create' };
        res.render('mainFrame', context);
    },

    create_process: (req, res) => {
        const b = req.body;
        const sql = `INSERT INTO person (loginid, password, name, mf, address, tel, birth, class) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        db.query(sql, [b.loginid, b.password, b.name, b.mf, b.address, b.tel, b.birth, b.class], (error) => {
            if (error) throw error;
            res.redirect('/person/view');
        });
    },

    update: (req, res) => {
        const { name, login, cls } = authIsOwner(req);
        const loginId = req.params.loginId;
        db.query('SELECT * FROM person WHERE loginid = ?', [loginId], (error, result) => {
            if (error) throw error;
            const context = { who: name, login, cls, body: 'personCU.ejs', mode: 'update', person: result[0] };
            res.render('mainFrame', context);
        });
    },

    update_process: (req, res) => {
        const b = req.body;
        const sql = `UPDATE person SET password=?, name=?, mf=?, address=?, tel=?, birth=?, class=? WHERE loginid=?`;
        db.query(sql, [b.password, b.name, b.mf, b.address, b.tel, b.birth, b.class, b.loginid], (error) => {
            if (error) throw error;
            res.redirect('/person/view');
        });
    },

    delete_process: (req, res) => {
        const loginId = req.params.loginId;
        db.query('DELETE FROM person WHERE loginid = ?', [loginId], (error) => {
            if (error) throw error;
            res.redirect('/person/view');
        });
    }
};