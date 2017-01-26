var express = require('express'),
    path = require('path'),
    app = express();

var fs = require('fs'),
    _ = require('lodash'),
    engines = require('consolidate'),
    bodyParser = require('body-parser');

function getUserFilePath (username) {
  return path.join(__dirname, 'users', username) + '.json';
}

function getUser (username) {
  var user = JSON.parse(fs.readFileSync(getUserFilePath(username), {encoding: 'utf8'}));
  user.name.full = _.startCase(user.name.first + ' ' + user.name.last);
  _.keys(user.location).forEach(function (key) {
    user.location[key] = _.startCase(user.location[key]);
  });
  return user;
}

function saveUser (username, data) {
  var fp = getUserFilePath(username);
  fs.unlinkSync(fp);
  fs.writeFileSync(fp, JSON.stringify(data, null, 2), {encoding: 'utf8'});
}

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

app.use('/profilepics', express.static('images'));
app.use(bodyParser.urlencoded({extended: true}));

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
    var user = getUser(username);
    res.render('user', {
        username,
        address: user.location
    });
});

app.put('/:username', (req, res) => {
    var username = req.params.username;
    var user = getUser(username);
    user.location = req.body;
    saveUser(username, user);
    res.end();
});

var server = app.listen(3000, () => {
    console.log('Server running at http://localhost:' + server.address().port)
});
