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
        db.query('SELECT * FROM boardtype', (error, results) => {
            if (error) throw error;
            const context = { who: name, login, cls, body: 'boardtype.ejs', results: results };
            res.render('mainFrame', context);
        });
    },

    create: (req, res) => {
        const { name, login, cls } = authIsOwner(req);
        const context = { who: name, login, cls, body: 'boardtypeCU.ejs', mode: 'create' };
        res.render('mainFrame', context);
    },

    create_process: (req, res) => {
        const b = req.body;
        const numPerPage = (b.numPerPage === '' || isNaN(b.numPerPage)) ? 10 : b.numPerPage;

        const sql = `INSERT INTO boardtype (title, description, write_YN, re_YN, numPerPage) VALUES (?, ?, ?, ?, ?)`;
        db.query(sql, [b.title, b.description, b.write_YN, b.re_YN, numPerPage], (error) => {
            if (error) throw error;
            res.redirect('/boardtype/view');
        });
    },

    update: (req, res) => {
        const { name, login, cls } = authIsOwner(req);
        const typeId = req.params.typeId; 
        db.query('SELECT * FROM boardtype WHERE type_id = ?', [typeId], (error, result) => {
            if (error) throw error;
            const context = { 
                who: name, 
                login, 
                cls, 
                body: 'boardtypeCU.ejs', 
                mode: 'update', 
                boardtype: result[0] 
            };
            res.render('mainFrame', context);
        });
    },

    update_process: (req, res) => {
        const b = req.body;
        const numPerPage = (b.numPerPage === '' || isNaN(b.numPerPage)) ? 10 : b.numPerPage;
        
        const sql = `UPDATE boardtype SET title=?, description=?, write_YN=?, re_YN=?, numPerPage=? WHERE type_id=?`;
        db.query(sql, [b.title, b.description, b.write_YN, b.re_YN, numPerPage, b.id], (error) => {
            if (error) throw error;
            res.redirect('/boardtype/view');
        });
    },

    delete_process: (req, res) => {
        const typeId = req.params.typeId;
        db.query('DELETE FROM boardtype WHERE type_id = ?', [typeId], (error) => {
            if (error) throw error;
            res.redirect('/boardtype/view');
        });
    }
};