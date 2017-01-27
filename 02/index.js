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

function verifyUser(req, res, next) {
    var fp = getUserFilePath(req.params.username);

    fs.exists(fp, (yes) => {
        if(yes) {
            next();
        } else {
            res.redirect('/error/' + req.params.username);
        }
    });
}

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
    var user = getUser(username);
    res.json(user);
});

app.all('/:username', (req, res, next) => {
    console.log(req.method, 'for', req.params.username);
    next();
});

app.get('/:username', verifyUser, (req, res) => {
    var username = req.params.username;
    var user = getUser(username);
    res.render('user', {
        username,
        address: user.location
    });
});

app.get('/error/:username', (req, res) => {
    res.status(404).send('No user named ' + req.params.username + ' found');
});

app.put('/:username', (req, res) => {
    var username = req.params.username;
    var user = getUser(username);
    user.location = req.body;
    saveUser(username, user);
    res.end();
});

app.delete('/:username', (req, res) => {
    var fp = getUserFilePath(req.params.username);
    fs.unlinkSync(fp);
    res.sendStatus(200);
});

var server = app.listen(3000, () => {
    console.log('Server running at http://localhost:' + server.address().port)
});
