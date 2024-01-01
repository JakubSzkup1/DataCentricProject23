var mysql = require('promise-mysql');
var pool

//Create a connection pool
mysql.createPool({
    connectionLimit: 3,
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'proj2023'
})
    .then(p => {
        pool = p
    })
    .catch(e => {
        console.log("pool error" + e)
    })

//Function thaty gets store
var getStores = function () {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM store')
            .then((data) => {
                resolve(data);
            })
            .catch(error => {
                console.log(error)
                reject(error);
            });
    });
}

//addStore function to allow user to add store
var addStore = function (sid, location, managerId) {
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO store (sid,location,mgrid) VALUES (?,?,?)', [sid, location, managerId])
            .then((result) => {
                resolve(result);
            })
            .catch((error) => {
                reject(error);
            });
    });
}
//getStoreId function fetches store by id
var getStoreById = function (sid) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM store WHERE sid=?', [sid])
            .then((results) => {
                if (results.length > 0) {
                    resolve(results[0]);
                } else {
                    resolve(null);
                }
            })
            .catch((error) => {
                reject(error);
            });
    });


}

//UpdateStore function updates store details
var updateStore = function (sid, location, managerId) {
    return new Promise((resolve, reject) => {
        pool.query('UPDATE store SET location = ?, mgrid = ? WHERE sid = ?', [location, managerId, sid])
            .then((result) => {
                resolve(result);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

//function for getting the products
var getProducts = function () {
    return new Promise((resolve, reject) => {
        pool.query(`
        SELECT p.pid, p.productdesc, s.sid, s.location, ps.price
        FROM product p
        JOIN product_store ps ON p.pid = ps.pid
        JOIN store s ON ps.sid = s.sid
    `)
            .then((results) => {
                resolve(results);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

//function for deleting the product
var deleteProduct = function (pid) {
    return new Promise((resolve, reject) => {
        pool.query('DELETE FROM product WHERE pid=?',[pid])
        .then((result)=>{
            resolve(result);
        })
        .catch((error)=>{
            reject(error);
        });
    });
}

//Here im exporting all the functions
module.exports = { getStores, addStore, getStoreById, updateStore, getProducts,deleteProduct };