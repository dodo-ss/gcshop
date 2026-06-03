var db = require('./db');
var sanitizeHtml = require('sanitize-html'); 

function authIsOwner(req,res){
    var name = 'Guest';
    var login = false;
    var cls = 'NON';
    if(req.session.is_logined){ 
        name = req.session.name;
        login = true;
        cls = req.session.cls ;
    }
    return {name, login, cls}
}

module.exports = {
    home : (req,res)=>{ 
        var {name, login, cls} = authIsOwner(req,res)
        var sql2 = ` select * from product;`
        db.query(sql2,(error,results)=>{
            var context = { 
                who : name,
                login: login,
                body : 'product.ejs',
                cls: cls,
                products: results };
            res.render('mainFrame',context,(err,html)=>{
                res.end(html)
            })
        })
    },

    categoryview: (req, res) => {
        const categ = req.params.categ; 
        const sql = `SELECT * FROM product WHERE main_id = ?;`;

        db.query(sql, [categ], (error, results) => {
            if (error) {
                console.error("카테고리별 상품 조회 중 에러: ", error);
                throw error; 
            }

            res.render('mainFrame', {
                title: '카테고리 상품 목록',
                body: 'product',
                products: results,
                login: req.session.is_logined ? true : false,
                who: req.session.is_logined ? req.session.name : 'Guest',
                cls: req.session.cls || ''
            });
        });
    }, 

    detailview: (req, res) => {
        const prodId = req.params.prodId;
        const sql = `SELECT * FROM product WHERE prod_id = ?;`;

        db.query(sql, [prodId], (error, results) => {
            if (error) {
                console.error("일반 상세페이지 조회 중 오류 발생:", error);
                throw error;
            }

            res.render('mainFrame', {
                title: '상품 상세 정보',
                body: 'productDetail', 
                product: results[0],
                login: req.session.is_logined ? true : false,
                who: req.session.is_logined ? req.session.name : 'Guest',
                cls: req.session.cls || ''
            });
        });
    }, 

    purchasedetailview: (req, res) => {
        const prodId = req.params.prodId;
        const sql = `SELECT * FROM product WHERE prod_id = ?;`;
        
        db.query(sql, [prodId], (error, results) => {
            if (error) {
                console.error("구매 상세페이지 조회 중 오류 발생:", error);
                throw error;
            }
            
            res.render('mainFrame', {
                title: '결제 및 장바구니',
                body: 'purchaseDetail',
                product: results[0],    
                login: req.session.is_logined ? true : false,
                who: req.session.is_logined ? req.session.name : 'Guest',
                cls: req.session.cls || ''
            });
        });
    },

    tablemanage: (req, res) => {
        const sql = `
            SELECT TABLE_NAME as table_name, TABLE_COMMENT as table_comment 
            FROM information_schema.TABLES 
            WHERE TABLE_SCHEMA = 'webdb2026';
        `; 

        db.query(sql, (error, results) => {
            if (error) {
                console.error("테이블 목록 조회 중 오류 발생:", error);
                throw error;
            }

            res.render('mainFrame', {
                title: '테이블 관리',
                body: 'tableManage',
                tables: results,     
                login: req.session.is_logined ? true : false,
                who: req.session.is_logined ? req.session.name : 'Guest',
                cls: req.session.cls || ''
            });
        });
    },

    tableview: (req, res) => {
        const tableName = req.params.tableName;

        const sqlHeader = `
            SELECT COLUMN_NAME, COLUMN_COMMENT 
            FROM information_schema.columns 
            WHERE table_schema = 'webdb2026' AND table_name = ?;
        `;
        
        const sqlData = `SELECT * FROM ${tableName};`; 

        db.query(sqlHeader, [tableName], (error, headers) => {
            if (error) throw error;

            db.query(sqlData, (error, rows) => {
                if (error) throw error;

                res.render('mainFrame', {
                    title: tableName + ' 자료 목록',
                    body: 'tableView', 
                    tName: tableName,
                    headers: headers,   
                    rows: rows,         
                    login: req.session.is_logined ? true : false,
                    who: req.session.is_logined ? req.session.name : 'Guest',
                    cls: req.session.cls || ''
                });
            });
        });
    }
}