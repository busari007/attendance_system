
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
  database:'test'
});

db.connect((err)=>{
    if(err){
        console.error('Error connecting to database',err)
    }else{
        console.log("Successfully connected to database");
    }
});


//query to create student account
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

//query for student log in
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

//query to create lecturer account
app.post('/lectRegister',(req,res)=>{
  const newMember = req.body;
  db.query('INSERT INTO lecturers SET ?',newMember,(err,result)=>{
      if(err){
          console.error('Error inserting data:',err)
          res.status(500).send('Error inserting data into database');
      }else{
          console.log("Lecturer created:",result);
          res.send("Lecturer created successfully");
      }
  });

members.push(newMember);

});

//query to log lectueres
app.post('/lectLogIn',(req,res)=>{
  const { lect_username, lect_password } = req.body;

   // Query the database for user authentication
   const query = 'SELECT * FROM lecturers WHERE lect_username = ? AND lect_password = ?';
   db.query(query, [lect_username, lect_password], (err, results) => {  //matricnum and password act as array values that will replace ? in the sql query query variable
     if (err) {
       console.error('Database query error:', err);
       res.status(500).json({ success: false, message: 'Internal server error' });
     } else {
       // Check if a user with matching credentials was found
       if (results.length > 0) {
         const user = results[0];
         res.json({ lect_password:user.lect_password, lect_username: user.lect_username, lect_id: user.lect_id, success: true }); 
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

//query to get lecturers id
app.post('/lectId', (req, res) => {
  const { lect_username } = req.body;
  db.query('SELECT lect_id FROM lecturers WHERE lect_username = ?', [lect_username], (err, result) => {
    if (err) {
      console.error("Query Error", err);
      res.status(500).json({ success: false, message: 'Internal server error' });
    } else {
      if (result.length > 0) {
       const lect_id = result[0];
        res.json({ lect_id: lect_id.lect_id, success: true });
      } else {
        res.status(401).json({ success: false, message: 'Lect Id not found' });
      }
    }
  });
});



//query for displaying the courses
app.post('/getCourses', (req, res) => {
  const { matric_num } = req.body;
  db.query('SELECT courses.course_name, course_code FROM courses JOIN users ON courses.matric_num = users.matric_num WHERE users.matric_num = ?', [matric_num], (err, result) => {
    if (err) {
      console.error("Query Error", err);
      res.status(500).json({ success: false, message: 'Internal server error' });
    } else {
      if (result.length > 0) {
        const courses = result.map(row => ({ course_name: row.course_name, course_code: row.course_code }));
        res.json({ courses, success: true });
      } else {
        res.status(401).json({ success: false, message: 'Matric Number not found' });
      }
    }
  });
});

app.post('/getLectCourses', (req, res) => {
  const { lect_id } = req.body;
  db.query('SELECT courses.course_name, course_code FROM courses JOIN lecturers ON courses.lect_id = lecturers.lect_id WHERE lecturers.lect_id = ?', [lect_id], (err, result) => {
    if (err) {
      console.error("Query Error", err);
      res.status(500).json({ success: false, message: 'Internal server error' });
    } else {
      if (result.length > 0) {
        const courses = result.map(row => ({ course_name: row.course_name, course_code: row.course_code }));
        res.json({ courses, success: true });
      } else {
        res.status(401).json({ success: false, message: 'Lecturers ID not found' });
      }
    }
  });
});


app.post('/attendance', async (req, res) => {  // to take attendance
  try {
    const { matric_num, course_id, status } = req.body;

    // Insert data into the Attendance table
    await db.query(
      'INSERT INTO attendance (matric_num, course_id, Status) VALUES (?, ?, "Present")',
      [matric_num, course_id, status]
    );

    console.log('Attendance record inserted successfully.');
    res.json({message:'Attendance record inserted successfully!'});
  } catch (error) {
    console.error('Error inserting attendance record:', error);
    res.status(500).send('Internal Server Error');
  }
});

// To get attendance records
app.post('/getAttendance', (req, res) => {
  const { matric_num } = req.body;

  const query = `
    SELECT
      a.attendanceID,
      a.matric_num,
      a.course_id,
      DATE_FORMAT(a.dateTaken, '%d-%m-%Y') AS dateTaken,
      TIME_FORMAT(a.timeTaken, '%H:%i') AS timeTaken,
      a.Status,
      c.course_code,
      c.course_name
    FROM
      attendance a
    INNER JOIN
      courses c ON a.course_id = c.course_id
    WHERE
      a.matric_num = ?;
  `;

  db.query(query, [matric_num], (err, result) => {
    if (err) {
      console.error("Query Error", err);
      res.status(500).json({ success: false, message: 'Internal server error' });
    } else {
      if (result.length > 0) {
        res.json({ records: result, success: true });
      } else {
        res.status(401).json({ success: false, message: 'No attendance records found for the specified matric_num' });
      }
    }
  });
});


//To get the course_id for recording attendance
app.post('/getCourseId', (req, res) => {
  const { matric_num, course_code } = req.body;
  db.query('SELECT c.course_id FROM courses c INNER JOIN users u ON c.matric_num = u.matric_num WHERE c.course_code = ? AND u.matric_num = ?'
  , [ course_code, matric_num],(err, result) => {
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
