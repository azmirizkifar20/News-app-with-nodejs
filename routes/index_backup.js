const koneksi = require('../config/db');
const validasi = require('../handlers/title-validation');
const express = require('express');
const router = express.Router();

// routing halaman index
router.get('/', (req, res) => {
    koneksi.query('SELECT * FROM news', (err, rows, fields) => {
        if (err) throw err;
        res.render('news/index', {
            title: 'News-App',
            headline: 'Berita terbaru',
            data: rows
        });
    });
});

// routing view
router.get('/view/:slug', (req, res) => {
    var sql = 'SELECT * FROM news WHERE ?';
    var slug = { slug: req.params.slug };

    koneksi.query(sql, slug, (err, rows, field) => {
        if (err) throw err;
        if (rows.length) {
            res.render('news/view', {
                title: rows[0].title,
                headline: 'Lihat berita',
                data: rows
            });
        } else {
            res.render('errors/404', {
                title: "Error Pages",
                message: "404 - The Page can't be found"
            });
        }
    });
});

// routing create article
router.get('/create', (req, res) => {
    res.render('news/create', {
        title: 'Posting Berita',
        headline: 'Buat berita baru'
    });

    router.post('/posting', (req, res) => {
        var word = req.body.title;
        var kecil = word.toLowerCase();
        var slug = kecil.split(' ').join('-');
        var sql = 'INSERT INTO news SET ?';
        var data = {
            title: req.body.title,
            slug: slug,
            text: req.body.text
        };

        koneksi.query(sql, data, (err, rows, field) => {
            if (err) throw err;
            console.log(rows.affectedRows + " data created!");
            res.redirect('/');
        });
    });

    // koneksi.query(sql1, title, (err, rows, field) => {
    //     if (err) throw err;

    //     if (rows.length) {
    //         console.log("wah sama");
    //         var alert = '<script>alert("Judul yang anda masukkan sudah ada!");';
    //         alert += 'document.location.href = "/create"</script>';
    //         res.end(alert);
    //     } else {
    //         koneksi.query(sql2, data, (err, rows, field) => {
    //             if (err) throw err;
    //             console.log(rows.affectedRows + " data created!");
    //             res.redirect('/');
    //         });
    //     }
    // });
});

// routing delete
router.get('/delete/:id', (req, res) => {
    var sql = 'DELETE FROM news WHERE ?';
    var id = { id: req.params.id };

    koneksi.query(sql, id, (err, rows, field) => {
        if (err) throw err;
        console.log(rows.affectedRows + " data deleted!");
        res.redirect('/');
    });
});

// routing edit
router.get('/edit/:id', (req, res) => {
    var sql = 'SELECT * FROM news WHERE ?';
    var id = { id: req.params.id };

    koneksi.query(sql, id, (err, rows, field) => {
        if (err) throw err;
        if (rows.length) {
            res.render('news/edit', {
                title: 'Edit berita',
                data: rows
            });
        } else {
            res.render('errors/404', {
                title: "Error Pages",
                message: "404 - The Page can't be found"
            });
        }
    });
});

// fungsi update
router.post('/update', (req, res) => {
    var sql = 'UPDATE news SET ? WHERE ?';
    var id = { id: req.body.id };
    var data = {
        title: req.body.title,
        text: req.body.text
    };

    koneksi.query(sql, [data, id], (err, rows, field) => {
        if (err) throw err;
        console.log(rows.changedRows + " data updated!");
        res.redirect('/');
    });
});

// 404 error page handling
router.get('*', function (req, res) {
    res.render('errors/404', {
        title: "Error Pages",
        message: "404 - The Page can't be found"
    });
});

module.exports = router;