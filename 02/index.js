var express = require('express'),
    app = express();

var fs = require('fs'),
    _ = require('lodash'),
    engines = require('consolidate');

var users = [];

fs.readFile('users.json', {encoding: 'utf-8'}, (err, data) => {
    if(err) throw err

    JSON.parse(data).forEach((user) => {
        user.name.full = _.startCase(user.name.first + ' ' + user.name.last);
        users.push(user);
    });
});

app.engine('hbs', engines.handlebars);
app.set('views', './views');
app.set('view engine', 'hbs');

app.get('/', (req, res) => {
    res.render('index', {users});
});

app.get(/big.*/, (req, res, next) => {
    console.log('BIG USER ACCESS');
    next();
});

app.get(/.*dog.*/, (req, res, next) => {
    console.log('DOG GO WOOF');
    next();
});

app.get('/:username', (req, res) => {
    var username = req.params.username;
    res.send(username);
});

var server = app.listen(3000, () => {
    console.log('Server running at http://localhost:' + server.address().port)
});
