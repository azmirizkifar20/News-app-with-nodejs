const controller = require('../controller/controller');
const express = require('express');
const router = express.Router();
var sendSlug;

// routing halaman index
router.get('/', (req, res) => {
    controller.index(res, 'SELECT * FROM news', 'news/index');
});

// routing view
router.get('/view/:slug', (req, res) => {
    var url = 'news/view';
    var errorsUrl = 'errors/404';

    controller.view(res, 'SELECT * FROM news WHERE ?', url, errorsUrl, {
        slug: req.params.slug
    });
});

// routing create article
router.get('/create', (req, res) => {
    controller.createView(res, 'news/create');
    controller.createFunction(router, '/posting');
});

// routing delete
router.get('/delete/:id', (req, res) => {
    controller.delete(res, 'DELETE FROM news WHERE ?', {
        id: req.params.id
    });
});

// routing edit
router.get('/edit/:slug', (req, res) => {
    controller.editView(res, 'SELECT * FROM news WHERE ?', {
        slug: req.params.slug
    });
    sendSlug = req.params.slug;

});

// fungsi update
router.post('/update', (req, res) => {
    var title = req.body.title;
    var id = { id: req.body.id };
    var lowerConvert = title.toLowerCase();
    var slug = lowerConvert.split(' ').join('-');
    var sql1 = 'SELECT * FROM news WHERE title = ?';
    var sql2 = 'UPDATE news SET ? WHERE ?';

    controller.editFunction(res, sql1, sql2, title, sendSlug, id, {
        title: title,
        slug: slug,
        text: req.body.text
    });
});

// 404 error page handling
router.get('*', function (req, res) {
    controller.errorPageHandling(res, 'errors/404');
});

module.exports = router;