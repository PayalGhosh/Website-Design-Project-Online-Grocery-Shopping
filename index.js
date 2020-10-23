//import the required modules
const http = require('http');
const fs = require('fs');
const path = require('path');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const hostname = 'localhost';
const port = 5000;
const url = 'mongodb://localhost:27017/';
const dbname = 'OrganicMantra';
const conn_mon = 'mongodb://localhost:27017/OrganicMantra';

//serve the static files
app.use('/public',express.static('public'));
app.use('/css',express.static('css'));
app.use('/images',express.static('images'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//connection to database
mongoose.connect(conn_mon , {useNewUrlParser:true});
console.log('Connected to Mongoose');

//define mongoose schema for message in contact form
const messageSchema = new mongoose.Schema({
    Name: { type: String, required: true},
    Email : {type : String, required :true},
    Contact : {type : String},
    Address :{type: String},
    Date: { type: Date, default: Date.now },
    Message : {type : String, required :true},
  });

//define mongoose schema for user registration schema
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password:  {
        type: String,
        required: true
    },
    admin:   {
        type: Boolean,
        default: false
    }
});

//schema to model
const Message = mongoose.model('message', messageSchema);
const User = mongoose.model('user',userSchema);

//handle all get requests at all endpoints
app.get('/',(req,res)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type','text/html');
    fs.createReadStream('./public/home.html').pipe(res);
});

app.get('/home.html',(req,res)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type','text/html');
    fs.createReadStream('./public/home.html').pipe(res);
});

app.get('/shop.html',(req,res)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type','text/html');
    fs.createReadStream('./public/shop.html').pipe(res);
});

app.get('/veg.html',(req,res)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type','text/html');
    fs.createReadStream('./public/veg.html').pipe(res);
});

app.get('/fruit.html',(req,res)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type','text/html');
    fs.createReadStream('./public/fruit.html').pipe(res);
});

app.get('/meat.html',(req,res)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type','text/html');
    fs.createReadStream('./public/meat.html').pipe(res);
});

app.get('/berry.html',(req,res)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type','text/html');
    fs.createReadStream('./public/berry.html').pipe(res);
});

app.get('/butter_eggs.html',(req,res)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type','text/html');
    fs.createReadStream('./public/butter_eggs.html').pipe(res);
});

app.get('/blog.html',(req,res)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type','text/html');
    fs.createReadStream('./public/blog.html').pipe(res);
});

app.get('/contact.html',(req,res)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type','text/html');
    fs.createReadStream('./public/contact.html').pipe(res);
});

app.get('/signin.html',(req,res)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type','text/html');
    fs.createReadStream('./public/signin.html').pipe(res);
});

app.get('/signup.html',(req,res)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type','text/html');
    fs.createReadStream('./public/signup.html').pipe(res);
});

app.get("/logout.html", function (req, res) { 
    res.redirect("/"); 
});

//handle all post requests at all endpoints

app.post("/contact/message.html",(req,res)=>{
    const sent_msg = new Message({'Name':req.body.name,'Email':req.body.email,'Contact':req.body.phone,'Address':req.body.address,'Message':req.body.msg});
    sent_msg.save().then(()=>{
        res.send('<html><body><h2>Thank you for contacting Us !</h2></body></html>');
    }).catch(()=>{
        res.status(400).send("<html><body><h1>Error!</h1></body></html>");
    })
});

app.post("/signup.html", function (req, res) { 
    User.findOne({email:req.body.email},(err,result)=>{
        if (err) throw err;
        console.log(result);
        if(result==null)
        {
            var regis = new User({email:req.body.email,password:req.body.password});
            regis.save();
            res.statusCode=200;
            res.setHeader('Content-Type','text/html');
            fs.createReadStream('./public/logout.html').pipe(res);
        }
        else
        {
            res.statusCode=403;
            res.setHeader('Content-Type','text/html');
            res.send('<h1>User already exists!</h1>')
        }
    }) 
});

app.post("/signin.html", (req,res)=>{
    User.findOne({email:req.body.email},(err,result)=>{
        if (err) throw err;
        console.log(result);
        if(result==null)
        {
            res.send('<h1>User has not registered yet!</h1>');
        }
        else if(result.password!=req.body.password)
        {
            res.send('<h1>Invalid Password</h1>');
        }
        else if(result.email==req.body.email && result.password==req.body.password)
        {
            res.statusCode=200;
            res.setHeader('Content-Type','text/html');
            fs.createReadStream('./public/logout.html').pipe(res);
        }
    })
});

app.post(['/','/home.html','/logout.html','/shop/newsletter.html','/veg/newsletter.html','/fruit/newsletter.html','/meat/newsletter.html','/butter_eggs/newsletter.html','/berry/newsletter.html','/blog.html','/contact/newsletter.html'],(req,res)=>{

    MongoClient.connect(url,(err,client)=>{
        //assert.equal(err,null);
        console.log('Connected to mongo server');

    const db = client.db(dbname);
    const collection = db.collection('newsletter');
    collection.insertOne({'email':req.body.newsEmail},(err,result)=>{
        //assert.equal(err,null);
        console.log('Inserted data');
        console.log(result.ops);

    res.send('<html><body><h2>You have been successfully subcribed to our newsletter!</h2><h3>Stay updated with the latest news</h3></body></html>');
    client.close();
    })
    })
});


app.post(['/shop/search.html','/veg/search.html','/fruit/search.html',,'/meat/search.html','/berry/search.html','/butter_eggs/search.html','/contact/search.html'],(req,res)=>{

       if(req.body.search=='vegetables' || req.body.search=='vegetable' || req.body.search=='veg')
       fs.createReadStream('./public/veg.html').pipe(res);
       if(req.body.search=='fruit' || req.body.search=='fruits' || req.body.search=='fruity')
       fs.createReadStream('./public/fruit.html').pipe(res);
       if(req.body.search=='meat' || req.body.search=='minced meat' || req.body.search=='non veg')
       fs.createReadStream('./public/meat.html').pipe(res);
       if(req.body.search=='berries' || req.body.search=='berry')
       fs.createReadStream('./public/berry.html').pipe(res);
       if(req.body.search=='butter' || req.body.search=='eggs' || req.body.search=='grocery' || req.body.search=='juices' )
       fs.createReadStream('./public/butter_eggs.html').pipe(res);

    });


app.listen(port,()=>{
    console.log(`Server listening at http://${hostname}:${port}`);
});
