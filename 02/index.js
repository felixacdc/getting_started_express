var express = require('express'),
    path = require('path'),
    app = express();

var fs = require('fs'),
    _ = require('lodash'),
    engines = require('consolidate'),
    bodyParser = require('body-parser'),
    helpers = require('./helpers');

app.engine('hbs', engines.handlebars);
app.set('views', './views');
app.set('view engine', 'hbs');

app.use('/profilepics', express.static('images'));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
    var users = [];

    fs.readdir('users', (err, files) => {
        files.forEach((file) => {
            fs.readFile(path.join(__dirname, 'users', file), {encoding: 'utf-8'}, (err, data) => {
                var user = JSON.parse(data);
                user.name.full = _.startCase(user.name.first + ' ' + user.name.last);
                users.push(user);
                if(users.length === files.length) res.render('index', {users});
            });
        });
    });

});

app.get(/big.*/, (req, res, next) => {
    console.log('BIG USER ACCESS');
    next();
});

app.get(/.*dog.*/, (req, res, next) => {
    console.log('DOG GO WOOF');
    next();
});

app.get('*.json', (req, res) => {
    res.download('./users/' + req.path, 'virus.exe');
});

app.get('/data/:username', (req, res) => {
    var username = req.params.username;
    var user = helpers.getUser(username);
    res.json(user);
});



app.get('/error/:username', (req, res) => {
    res.status(404).send('No user named ' + req.params.username + ' found');
});

var userRouter = require('./username');
app.use('/:username', userRouter);

var server = app.listen(3000, () => {
    console.log('Server running at http://localhost:' + server.address().port)
});
