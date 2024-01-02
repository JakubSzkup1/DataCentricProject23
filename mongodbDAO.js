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


        // //Heres is the validation for manager id, name and salary //struggled with making validation work
        //  //manager id must be 4 chars
        //  if (managerId.length !== 4) {
        //     reject(new Error('Manager ID must be 4 characters long.')); //error message returned
        //     return;
        // }
        // //name must be > 5 chars
        // if (name.length <= 5) {
        //     reject(new Error('Name must be more than 5 characters long.')); //error message returned
        //     return;
        // }

        // //salary must be between 30k and 70k
        // salary = Number(salary);//coverting the string to a number
        // if(salary <3000 || salary > 70000){
        //     reject(new Error('Salary must be between 30,000 and 70,000.')); //error message
        //     return;
        // }   

    

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