var router = require('express').Router();

let mydb;
const mongoClient = require('mongodb').MongoClient;
const ObjId = require('mongodb').ObjectId;
const url = process.env.DB_URL;
mongoClient.connect(url)
.then(client=>{
    mydb = client.db('myboard');
})
.catch(err=>{
    console.log(err);
})


router.get('/signup', function(req, res){
    res.render('signup.ejs');
})


module.exports = router;