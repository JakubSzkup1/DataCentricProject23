const MongoClient = require('mongodb').MongoClient

MongoClient.connect('mongodb://127.0.0.1:27017')
    .then((client) => {
        db = client.db('proj2023MongoDB')
        coll = db.collection('managers')
    })
    .catch((error) => {
        console.log(error.message)


    })
//function finds all managers
var findAll = function () {
    return new Promise((resolve, reject) => {
        var cursor = coll.find()
        cursor.toArray()
            .then((documents) => {
                resolve(documents)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

//function to add manager
var addManager = function (managerId, name, salary) {
    return new Promise((resolve, reject) => {

        coll.insertOne({
            _id: managerId,
            name: name,
            salary: salary
        })
            .then((result) => {
                resolve(result);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

//exporting functions
module.exports = { findAll, addManager }