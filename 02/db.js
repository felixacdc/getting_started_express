var uri = 'mongodb://localhost:27017/test';

// con mongo nativo
/*var MongoClient = require('mongodb').MongoClient;

var findUsers = (db, callback) => {
    var cursor = db.collection('users').find();
    cursor.each((err, doc) {
        if(doc != null) {
            console.dir(doc);
        } else {
            callback();
        }
    });
}

MongoClient.connect(uri, (err, db) => {
    findUsers(db, () => {
        db.close();
    });
});*/