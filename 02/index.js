var express = require('express'),
    app = express();

var fs = require('fs'),
    _ = require('lodash');

var users = [];

fs.readFile('users.json', {encoding: 'utf-8'}, (err, data) => {
    if(err) throw err

    JSON.parse(data).forEach((user) => {
        user.name.full = _.startCase(user.name.first + ' ' + user.name.last);
        users.push(user);
    });
})

app.get('/', (req, res) => {
    res.send(JSON.stringify(users, null, 2));
});

app.get('/yo', (req, res) => {
    res.send('YO!');
});

var server = app.listen(3000, () => {
    console.log('Server running at http://localhost:' + server.address().port)
});
