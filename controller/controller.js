const koneksi = require('../handlers/database');
const validasi = require('../handlers/validation');

exports.index = function (response, statement, renderURL) {
    koneksi.query(statement, (err, rows, fields) => {
        if (err) throw err;
        response.render(renderURL, {
            title: 'News-App',
            headline: 'Berita terbaru',
            data: rows
        });
    });
}

exports.view = function (response, sql, renderURL, renderErrorsURL, slug) {
    koneksi.query(sql, slug, (err, rows, field) => {
        if (err) throw err;
        if (rows.length) {
            response.render(renderURL, {
                title: rows[0].title,
                headline: 'Lihat berita',
                data: rows
            });
        } else {
            response.render(renderErrorsURL, {
                title: "Error Pages",
                message: "404 - The Page can't be found"
            });
        }
    });
}

exports.createView = function (response, renderURL) {
    response.render(renderURL, {
        title: 'Posting Berita',
        headline: 'Buat berita baru'
    });
}

exports.createFunction = function (router, url) {
    router.post(url, (req, res) => {
        var title = req.body.title;
        var text = req.body.text;
        var titleKecil = title.toLowerCase();
        var slug = titleKecil.split(' ').join('-');

        var sql1 = 'SELECT * FROM news WHERE title = ?';
        var sql2 = 'INSERT INTO news SET ?';
        var data = {
            title: title,
            slug: slug,
            text: text
        };

        validasi.titleCreate(sql1, title, sql2, data, res);
    });
}

exports.delete = function (response, sql, id) {
    koneksi.query(sql, id, (err, rows, field) => {
        if (err) throw err;
        console.log(rows.affectedRows + " data deleted!");
        response.redirect('/');
    });
}

exports.editView = function (response, sql, slug) {
    koneksi.query(sql, slug, (err, rows, field) => {
        if (err) throw err;
        if (rows.length) {
            response.render('news/edit', {
                title: 'Edit berita',
                data: rows
            });
        } else {
            response.render('errors/404', {
                title: "Error Pages",
                message: "404 - The Page can't be found"
            });
        }
    });
}

exports.editFunction = function (response, statement1, statement2, title, sendSlug, id, data) {
    var dataSend = [data, id];
    validasi.titleUpdate(statement1, title, statement2, dataSend, response, sendSlug);
}

exports.errorPageHandling = function (response, renderURL) {
    response.render(renderURL, {
        title: "Error Pages",
        message: "404 - The Page can't be found"
    });
}