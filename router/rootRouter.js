const express= require('express');
const router= express.Router();
const db = require('../lib/db');
var root = require('../lib/root');


router.get('/', (req,res)=>{
    root.home(req,res)
});


router.get('/category/:categ', (req, res) => {
    root.categoryview(req, res);
});


router.post('/shop/search', (req, res) => {
    const body = req.body; 
    const sql = `
        SELECT * FROM product 
        WHERE name LIKE ? OR brand LIKE ? OR supplier LIKE ?;
    `;
    const searchWord = `%${body.search}%`;
    
    db.query(sql, [searchWord, searchWord, searchWord], (error, results) => {
        if (error) {
            console.error("상품 검색 중 오류 발생:", error);
            return res.status(500).send("Internal Server Error");
        }
        
        res.render('mainFrame', {
            title: '검색 결과',
            body: 'product',          
            products: results,         
            login: req.session.is_logined ? true : false, 
            who: req.session.is_logined ? req.session.name : 'Guest',
            cls: req.session.cls || ''
        });
    });
});

router.get('/detail/:prodId', (req, res) => {
    root.detailview(req, res); 
});

router.get('/purchase/detail/:prodId', (req, res) => {
    root.purchasedetailview(req, res); 
});

router.get('/table/manage', (req, res) => {
    root.tablemanage(req, res);
});

router.get('/table/view/:tableName', (req, res) => {
    root.tableview(req, res); 
});


router.get('/anal/customer', (req, res) => {
    const sql = `
        SELECT 
            SUBSTRING(address, 1, 2) AS region,
            ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM person), 0) AS ratio
        FROM person
        GROUP BY SUBSTRING(address, 1, 2);
    `;

    db.query(sql, (error, results) => {
        if (error) {
            console.error("지역 통계 조회 에러:", error);
            return res.status(500).send("Internal Server Error");
        }

        res.render('mainFrame', {
            body: 'customeranal', 
            stats: results,       
            who: req.session.who || '경영진',
            login: req.session.login || true,
            cls: req.session.cls || 'CEO'
        });
    });
});

module.exports = router;