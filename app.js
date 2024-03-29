require('./handlers/helpers');
const path = require('path');
const express = require('express');
const favicon = require('serve-favicon');
const routes = require('./routes/index');
const bodyParser = require('body-parser');
const app = express();

// set view dan view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// set body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// set favicon
app.use(favicon(path.join(__dirname, 'public/img', 'favicon.ico')));

// set public folder as assets
app.use('/assets', express.static(__dirname + '/public'));

// set routing
app.use('/', routes);

// buat server
app.listen(3000, () => {
    console.log('Server running at port 3000');
});