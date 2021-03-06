var express = require('express');
var morgan = require('morgan');//output logs
var path = require('path');
var crypto = require('crypto');
var config = {
    user: 'rohithp0304',
    database: 'rohithp0304',
    host: 'db.imad.hasura-app.io',
    port: '5432',
    password: process.env.DB_PASSWORD
};
var bodyParser = require('body-parser');
var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

var articles  = {
articleOne : {
  title:'Rohith HE| Article one' , 
  heading:'Article one' ,
  date : 'Feb 19 2018'  ,
  content:`
  <p>
      This is the content for my first article.This is the content for my first article.
      This is the content for my first article.This is the content for my first article.
      This is the content for my first article.
  </p>
  <p>
      This is the content for my first article.This is the content for my first article.
      This is the content for my first article.This is the content for my first article.
      This is the content for my first article.
  </p>
  <p>
      This is the content for my first article.This is the content for my first article.
      This is the content for my first article.This is the content for my first article.
      This is the content for my first article.
  </p>
  `
} , 
articleTwo:{
  title:'Rohith HE| Article two' , 
  heading:'Article two' ,
  date : 'Feb 20 2018'  ,
  content:`
  <p>
      This is the content for my second article.This is the content for my first article.
  
  `
},
articleThree: {
  title:'Rohith HE| Article three' , 
  heading:'Article three' ,
  date : 'Feb 20 2018'  ,
  content:`
  <p>
      This is the content for my third article.This is the content for my first article.
  
  `
}
};

function createTemplate (data) {
    var title = data.title;
    var date = data.date;
    var heading = data.heading;
    var content = data.content;

    var htmlTemplate = `
    <html>
      <head>
          <title>
              ${title}
          </title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link href="/ui/style.css" rel="stylesheet" />
      </head>
      <body>
          <div class="container">
              <div>
                  <a href="/">Home</a>
              </div>
              <hr/>
              <h3>
                  ${heading}
              </h3>
              <div>
                  ${date.toDateString()}
              </div>
              <div>
                ${content}
              </div>              
          </div>
      </body>
    </html>
    `;
    return htmlTemplate;
}

var counter =0;

app.get('/counter' , function(req,res){
  counter = counter +1;
  res.send(counter.toString());

});
app.get('/:articleName' , function(req ,res){
  var articleName = req.param.articleName;
  res.send(createTemplate(articles[articleName]));
  //res.sendFile(path.join(__dirname, 'ui', 'article-one.html'));
});

// app.get('/article-two' , function(req ,res){
//   res.sendFile(path.join(__dirname, 'ui', 'article-two.html'));
// });
// app.get('/article-three' , function(req ,res){
//   res.sendFile(path.join(__dirname, 'ui', 'article-three.html'));
// });
app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});

function hash (input, salt) {
    //how do we create a hash?
    var hashed = crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512');
    return ['pbkdf2', '10000', salt,hashed.toString('hex')].join('$');
}
app.get('/hash/:input', function(req, res) {
    var hashedString = hash(req.params.input, 'this-is-some-random-string');
    res.send(hashedString);
    
});
app.get('/ui/Portrait.jpg', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'Portrait.jpg'));
});
app.post('/create-user', function(req, res){
//username,password
//JSOn
//("username":'rohithp0304', 'password': password)
var username = req.body.username;
var password = req.body.password;
var salt = randombytes(128).toString('hex');
var dbString = hash(password, salt);
pool.query('INSERT INTO "user" (username, password) VALUES ($1, $2)', [username, dbString], function (err, result){
    if (err) {
        res.status(500).send(err.toString());
    } else {
        res.send('User succesfully created: ' +username);
    }
});
});

app.post('/login', function (req, res) {
 var username = req.body.username;
var password = req.body.password;
pool.query('SELECT * FROM "user" WHERE username = $1', [username], function (err, result){
    if (err) {
        res.status(500).send(err.toString());
    } else {
        if (result.rows.length === 0) {
            res.send(403).send('No user');
        } else {
            //Match the password
            var dbString = result.rows[0].password;
            var salt = dbString.split('$')[2];
            var hashedPassword = hash(password, salt);
            if (hashedPassword === dbString) {
                res.send('credentials correct');
            } else {
                res.send(403).send('No user');
            }
        }
    }
});   
});
// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});