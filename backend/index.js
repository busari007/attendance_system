const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 5000;
const members = require('./members');
const uuid = require('uuid');
const mysql = require('mysql');


app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cors({
    origin: 'http://localhost:3000', 
     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
}));


app.get('/',(req,res)=>{
    db.query('SELECT * FROM users', (err, result) => {
        if (err) {
          console.error('Error executing the SELECT query:', err); 
        }else{
         console.log("Data retrieved and displayed @ http://localhost:5000/");
        res.json(result);
        }
        }
    );
});

const db = mysql.createConnection({
  host:'localhost',
  user:'busari007',
  password:'obey4show',
  database:'user_accounts'
});

db.connect((err)=>{
    if(err){
        console.error('Error connecting to database',err)
    }else{
        console.log("Successfully connected to database");
    }
});


app.post('/register',(req,res)=>{
    const newMember = req.body;
    db.query('INSERT INTO users SET ?',newMember,(err,result)=>{
        if(err){
            console.error('Error inserting data:',err)
            res.status(500).send('Error inserting data into database');
        }else{
            console.log("User created:",result);
            res.send("User created successfully");
        }
    });

  members.push(newMember);

});

app.post('/logIn',(req,res)=>{
   const { matric_num, password } = req.body;

    // Query the database for user authentication
    const query = 'SELECT * FROM users WHERE matric_num = ? AND password = ?';
    db.query(query, [matric_num, password], (err, results) => {  //matricnum and password act as array values that will replace ? in the sql query query variable
      if (err) {
        console.error('Database query error:', err);
        res.status(500).json({ success: false, message: 'Internal server error' });
      } else {
        // Check if a user with matching credentials was found
        if (results.length > 0) {
          const user = results[0];
          res.json({ matric_num: user.matric_num, password:user.password, username: user.username, success: true }); 
        } else {
          res.status(401).json({ success: false, message: 'Invalid matric_num or password' });
        }
       }
    });
});

//query for creating courses
app.post('/courses', (req, res) => {
  const newCourse = req.body;
  db.query('INSERT INTO courses SET ?', newCourse, (err, result) => {
    if (err) {
      console.error('Error inserting data:', err)
      res.status(500).send('Error inserting data into the database');
    } else {
      console.log('Course created:', result);
      res.send('Course created successfully');
    }
  });
});

// Query for fetching all courses
app.get('/courses', (req, res) => {
  db.query('SELECT * FROM courses', (err, result) => {
    if (err) {
      console.error('Error executing the SELECT query:', err);
      res.status(500).send('Error retrieving data from the database');
    } else {
      res.json(result);
    }
  });
});

app.listen(5000, () => {
  console.log('Server started on port 5000');
});