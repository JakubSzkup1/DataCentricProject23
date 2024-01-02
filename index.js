//index.js
var express = require('express');
let ejs = require('ejs');
var mysql = require('./mySqlDAO'); //SQl DAO
var mongodbDAO = require('./mongodbDAO'); //MongoDB DAO
var app = express();
var bodyParser = require('body-parser');

app.set('view engine', 'ejs')

//body-parser middleware 
app.use(bodyParser.urlencoded({ extended: true }));

// Home page route
app.get('/', (req, res) => {
    res.render('index'); //renders index.js file
});

// Route to display the Stores page
app.get('/stores', (req, res) => {
    mysql.getStores()  //function in mySqlDAO
        .then((data) => {
            console.log(data)
            res.render("stores", { "stores": data })
        })
        .catch((error) => {
            res.send(error)
        })

});
//Route to display the add store page
app.get('/stores/add', (req, res) => {
    res.render('addStore');
});

// Route to handle the post request from add store 
app.post('/stores/add', (req, res) => {
    const { sid, location, managerId } = req.body;



    mysql.addStore(sid, location, managerId)//function in mySqlDAO
        .then(() => {
            res.redirect('/stores');
        })
        .catch((error) => {
            res.status(500).send(error.message);
        });
});

//Function to edit store page
app.get('/stores/edit/:sid', (req, res) => {
    const sid = req.params.sid;

    mysql.getStoreById(sid)//function in mySqlDAO
        .then((store) => {
            if (store) {
                res.render('editStore', { store: store });
            } else {
                res.status(404).send('Store not found');
            }
        })
        .catch((error) => {
            res.send('Error: ' + error.message);
        });
});

// Route to handle the POST request from the Edit Store form
app.post('/stores/edit/:sid', (req, res) => {
    const sid = req.params.sid;
    const { location, managerId } = req.body;

    // validation required
    if (location.length < 1) {
        return res.status(400).send('Location must be at least 1 character.');
    }
    if (managerId.length !== 4) {
        return res.status(400).send('Manager ID must be 4 characters.');
    }

    mysql.updateStore(sid, location, managerId)
        .then(() => {
            res.redirect('/stores');
        })
        .catch((error) => {
            res.status(500).send(error.message);
        });
});

// Route for Products
app.get('/products', (req, res) => {
    //handles Products page
    mysql.getProducts() //function in mySqlDAO
        .then((products) => {
            res.render('products', { products: products }); //renders from view product.ejs
        })
        .catch((error) => {
            res.send('Error: ' + error.message);
        });
});

// Route to handle the Delete action for a product   
app.post('/products/delete/:pid', (req, res) => {  //Issue - cant delete every product **Needs to be fixed*
                                                    //Error: ER_ROW_IS_REFERENCED_2: Cannot delete or update a parent row:
    const pid = req.params.pid;                    //a foreign key constraint fails (`proj2023`.`product_store`, CONSTRAINT `product_store_ibfk_1` FOREIGN KEY (`pid`) REFERENCES `product` (`pid`))
    mysql.deleteProduct(pid) //muySqlDAO function
        .then(() => {
            res.redirect('/products');
        })
        .catch((error) => {
            res.send('Error: ' + error.message);
        });
});


// Route for Managers (MongoDB)
app.get('/managers', (req, res) => {
    //handles Managers page
    mongodbDAO.findAll()
        .then(managers => {
            res.render('managers', { managers: managers });
        })
        .catch(err => {
            res.status(500).send('Error fetching managers: ' + err.message);
        });
});

//Route to add managers
app.get('/managers/add', (req, res) => {
    res.render('addManager');
});

app.post('/managers/add', (req, res) => {
    const { managerId, name, salary } = req.body;

    mongodbDAO.addManager(managerId, name, salary)
        .then(() => {
            res.redirect('/managers');
        })
        .catch((error) => {
            res.render('addManager', { error: error.message, managerId, name, salary });
        });
});






//listening on localhost port 3000
app.listen(3000, () => {
    console.log("Running on port 3000")
})