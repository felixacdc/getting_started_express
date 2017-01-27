var express = require('express'),
    helpers = require('./helpers'),
    fs = require('fs');

var router = express.Router({
  mergeParams: true
});

router.use((req, res, next) => {
        console.log(req.method, 'for', req.params.username, ' at ' + req.path);
        next();
    });

router.get('/', (req, res) => {
        var username = req.params.username;
        var user = helpers.getUser(username);
        res.render('user', {
            username,
            address: user.location
        })
    });

router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

router.get('/edit', (req, res) => {
    res.send('You want to edit ' + req.params.username + '???');
});

router.put('/',(req, res) => {
        var username = req.params.username;
        var user = helpers.getUser(username);
        user.location = req.body;
        helpers.saveUser(username, user);
        res.end();
    });

router.delete('/',(req, res) => {
        var fp = helpers.getUserFilePath(req.params.username);
        fs.unlinkSync(fp);
        res.sendStatus(200);
    });

module.exports = router;