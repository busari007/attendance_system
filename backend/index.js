const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 5000;
const members = require('./members');
const uuid = require('uuid');
const mysql = require('mysql');
const https = require('https');
const fs = require('fs');

app.use(express.json()); 
app.use(express.urlencoded({extended:false}));
app.use(cors({
    origin: '*', //* allows requests from any device
     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
}));

const options = {    //secure server setup
  ca: fs.readFileSync('../https_setup/ca.crt'),
  cert: fs.readFileSync('../https_setup/cert.crt'),
  key: fs.readFileSync('../https_setup/cert.key')
};

app.get('/',(req,res)=>{
    db.query('SELECT * FROM users', (err, result) => {
        if (err) {
          console.error('Error executing the SELECT query:', err); 
        }else{
         console.log(`Data retrieved and displayed @ http://localhost:${PORT}/`);
        res.json(result);
        }
        }
    );
});

const db = mysql.createConnection({
  host:'localhost',
  user:'busari007',
  password:'obey4show',
  database:'attendance_system'
});

db.connect((err)=>{
    if(err){
        console.error('Error connecting to database',err)
    }else{
        console.log("Successfully connected to database");
    }
});

//query to create student account
app.post('/register', (req, res) => {
  const { username, matric_num, password, email } = req.body;
  const newUser = { username, matric_num, password, email };

  // Check if username and matriculation number combination already exists in the database
  db.query('SELECT * FROM users WHERE username = ? AND matric_num = ?', [username, matric_num], (err, results) => {
      if (err) {
          console.error('Error checking username/matric_num combination:', err);
          return res.status(500).send('Error checking username/matric_num combination in database');
      }

      if (results.length > 0) {
          const errorMessage = "Username and matriculation number combination already exists. Please choose different credentials.";
          console.error(errorMessage);
          return res.status(400).send(errorMessage);
      }

      // Insert new user if username and matric_num combination are unique
      db.query('INSERT INTO users SET ?', newUser, (err, result) => {
          if (err) {
              console.error('Error inserting data:', err);
              return res.status(500).send('Error inserting data into database');
          }
          console.log("User created:", result);
          res.send("User created successfully");
      });
  });
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
app.post('/lectRegister', (req, res) => {
  const { lect_email, lect_username, lect_password } = req.body;
  const newMember = { lect_email, lect_username, lect_password };

  // Check if the username already exists in the database
  db.query('SELECT * FROM lecturers WHERE lect_username = ?', lect_username, (err, results) => {
      if (err) {
          console.error('Error checking username:', err);
          return res.status(500).send('Error checking username in database');
      }

      if (results.length > 0) {
          const errorMessage = "Username already exists. Please choose a different username.";
          console.error(errorMessage);
          return res.status(400).send(errorMessage);
      }

      // Insert new member if username is unique
      db.query('INSERT INTO lecturers SET ?', newMember, (err, result) => {
          if (err) {
              console.error('Error inserting data:', err);
              return res.status(500).send('Error inserting data into database');
          }
          console.log("Lecturer created:", result);
          res.send("Lecturer created successfully");
      });
  });
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
  const { course_code, session, department, course_name, lect_id } = req.body;
  const newCourse = {course_code, session, department, course_name, lect_id};

  // Check if course already exists for the matric_num or lect_id
  db.query(
    'SELECT * FROM courses WHERE course_code = ?',
    [course_code],
    (err, existingCourses) => {
      if (err) {
        console.error('Error checking existing courses:', err);
        res.status(500).send('Error checking existing courses');
      } else {
        if (existingCourses && existingCourses.length > 0) {
          res.status(409).send('Course already exists for the lect_id');
        } else {
          // No existing courses found, proceed with insertion
          db.query('INSERT INTO courses SET ?', newCourse, (insertErr, result) => {
            if (insertErr) {
              console.error('Error inserting data:', insertErr);
              res.status(500).send('Error inserting data into the database');
            } else {
              console.log('Course created:', result);
              res.send('Course created successfully');
            }
          });
        }
      }
    }
  );
});

//to create courses for students
app.post('/studentCourses', (req, res) => {
  const { course_id, matric_num } = req.body;
  const newCourse = req.body;

  // Check if course already exists for the course_id or matric_num
  db.query(
    'SELECT * FROM studentcourses WHERE course_id = ? AND matric_num = ?',
    [course_id, matric_num],
    (err, existingCourses) => {
      if (err) {
        console.error('Error checking existing courses:', err);
        res.status(500).send('Error checking existing courses');
      } else {
        if (existingCourses && existingCourses.length > 0) {
          res.status(409).send('Course already exists for the course_id or matric_num');
          console.log(existingCourses);
        } else {
          // No existing courses found, proceed with insertion
          db.query('INSERT INTO studentcourses SET ?', newCourse, (insertErr, result) => {
            if (insertErr) {
              console.error('Error inserting data:', insertErr);
              res.status(500).send('Error inserting data into the database');
            } else {
              console.log('Course created:', result);
              res.send('Course created successfully');
            }
          });
        }
      }
    }
  );
});

//to get the courses for students to pick from
app.get('/courses', (req, res) => {
  db.query('SELECT * FROM courses', (err, result) => {
    if (err) {
      console.error('Error executing the SELECT query:', err); 
      res.status(500).send('Internal Server Error');
    } else {
      // Transform the result into an array of objects
      const coursesArray = result.map(course => ({
        course_id: course.course_id,
        course_code: course.course_code,
        course_name: course.course_name,
        lect_id: course.lect_id,
        department: course.department,
        session: course.session
      }));

      console.log(`Courses options sent`);
      res.json(coursesArray);
    }
  });
});

//to delete courses
app.post('/deleteCourses', (req, res) => {
  const { course_id } = req.body;
  // Check if all required parameters are provided
  if (!course_id) {
    return res.status(400).send('Missing required parameters');
  }

  // Delete course from the database
  db.query('DELETE FROM studentcourses WHERE course_id = ?', [course_id], (err, result) => {
    if (err) {
      console.error('Error deleting course:', err);
      res.status(500).send('Error deleting course from the database');
    } else {
      if (result.affectedRows > 0) {
        console.log('Course deleted successfully');
        res.send('Course deleted successfully');
      } else {
        res.status(404).send('Course not found');
      }
    }
  });
});

app.post('/deleteLectCourses', (req, res) => {
  const { course_code, course_name, course_id } = req.body;
  // Check if all required parameters are provided
  if (!course_code || !course_name || !course_id) {
    return res.status(400).send('Missing required parameters');
  }

  // Delete course and corresponding attendance records from the database
  db.query('DELETE courses, attendance FROM courses LEFT JOIN attendance ON courses.course_id = attendance.course_id WHERE courses.course_code = ? AND courses.course_name = ? AND courses.course_id = ?', [course_code, course_name, course_id], (err, result) => {
    if (err) {
      console.error('Error deleting course:', err);
      res.status(500).send('Error deleting course and attendance records from the database');
    } else {
      if (result.affectedRows > 0) {
        console.log('Course and corresponding attendance records deleted successfully');
        res.send('Course and corresponding attendance records deleted successfully');
      } else {
        res.status(404).send('Course not found');
      }
    }
  });
});

//to delete attendance record
app.post('/deleteRecord', (req, res) => {
  const { attendanceID } = req.body;

  // Delete record from the database
  db.query('DELETE FROM attendance WHERE attendanceID = ?', [attendanceID], (err, result) => {
    if (err) {
      console.error('Error deleting record:', err);
      res.status(500).send('Error deleting record from the database');
    } else {
      if (result.affectedRows > 0) {
        console.log('Record deleted successfully');
        res.send('Record deleted successfully');
      } else {
        res.status(404).send('Record not found');
      }
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

//query to get lecturers id and course_codes offered by the lecturer
app.post('/lectId', (req, res) => {
const { lect_username } = req.body;
db.query('SELECT l.lect_id, c.course_code FROM lecturers l LEFT JOIN courses c ON l.lect_id = c.lect_id WHERE l.lect_username = ?', [lect_username], (err, result) => {
  if (err) {
    console.error("Query Error", err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } else {
    if (result.length > 0) {
      const lect_id = result[0].lect_id;
      const courseCodes = result.map(row => row.course_code); // Extract course codes from each row
      res.json({ lect_id ,courseCodes, success: true });
    } else {
      res.status(401).json({ success: false, message: 'Lect Id not found' });
    }
  }
});
});

//query for displaying the courses
app.post('/getCourses', (req, res) => {
  const { matric_num } = req.body;
  db.query(
    'SELECT c.course_name, c.course_code, c.course_id FROM studentcourses sc JOIN courses c ON sc.course_id = c.course_id WHERE sc.matric_num = ?',
    [matric_num],
    (err, result) => {
      if (err) {
        console.error("Query Error", err);
        res.status(500).json({ success: false, message: 'Internal server error' });
      } else {
        if (result.length > 0) {
          const courses = result.map(row => ({
            course_name: row.course_name,
            course_code: row.course_code,
            course_id: row.course_id
          }));
          res.json({ courses, success: true });
        } else {
          res.status(401).json({ success: false, message: 'Matric Number not found' });
        }
      }
    }
  );
});

app.post('/getLectCourses', (req, res) => {
const { lect_id } = req.body;
db.query('SELECT courses.course_name, course_code, course_id FROM courses WHERE lect_id = ?', [lect_id], (err, result) => {
  if (err) {
    console.error("Query Error", err);
    res.status(500).json({ success: false, message: 'Internal server error' });
    console.log(err);
  } else {
    if (result.length > 0) {
      const courses = result.map(row => ({ course_name: row.course_name, course_code: row.course_code, course_id: row.course_id }));
      res.json({ courses, success: true });
    } else {
      res.status(401).json({ success: false, message: 'Lecturers ID not found' });
    }
  }
});
});

app.post('/attendance', async (req, res) => {
  const { matric_num, course_id, Status } = req.body;

  // Check if the matric_num has the course_id tied to it in the studentcourses table
  db.query('SELECT * FROM studentcourses WHERE matric_num = ? AND course_id = ?', [matric_num, course_id], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "Error checking student's course" });
    } else {
      if (result.length === 0) {
        // If no matching record found, return error
        res.status(404).json({ message: "No such course found for the provided student" });
      } else {
        // Matching record found, proceed with inserting attendance
        db.query('SELECT lect_id FROM courses WHERE course_id = ?', [course_id], (err, result) => {
          if (err) {
            console.log(err);
            res.status(404).json({ message: "No such course found" });
          } else {
            console.log(result);
            const lect_id = result[0].lect_id;

            db.query('INSERT INTO attendance (matric_num, course_id, lect_id, Status) VALUES (?, ?, ?, ?)',
              [matric_num, course_id, lect_id, Status], (error, insertResult) => {
                if (error) {
                  console.log(error);
                  res.status(500).json({ message: "Error inserting attendance record" });
                } else {
                  console.log(insertResult);
                  res.json({ message: "Attendance inputted successfully" });
                }
              });
          }
        });
      }
    }
  });
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
    a.matric_num = ?
  `;

  db.query(query, [matric_num], (err, result) => {
      if (err) {
          console.error("Query Error", err);
          return res.status(500).json({ success: false, message: 'Internal server error' });
      }

      if (result.length > 0) {
          // User has attendance records, return the records
          return res.json({ records: result, success: true });
      }

      // If no attendance records found for the specified matric_num, 
      // check if the user has registered courses directly
      const registeredCoursesQuery = `
          SELECT * 
          FROM courses 
          WHERE course_id IN (SELECT course_id FROM studentcourses WHERE matric_num = ?)
      `;
      db.query(registeredCoursesQuery, [matric_num], (coursesErr, coursesResult) => {
          if (coursesErr) {
              console.error("Courses Query Error", coursesErr);
              return res.status(500).json({ success: false, message: 'Internal server error' });
          }

          if (coursesResult.length > 0) {
              // User has registered courses but no attendance records
              return res.status(401).json({ success: false, message: 'No attendance records found for the specified matric_num' });
          }

          // User has no registered courses
          return res.status(401).json({ success: false, message: 'No registered courses' });
      });
  });
});

// To get attendance records
app.post('/getStudentsAttendance', (req, res) => {
const { course_code } = req.body;

const query = `
SELECT DISTINCT c.course_name, 
       c.course_code, 
       c.course_id,
       a.matric_num,
       DATE_FORMAT(a.dateTaken, '%d-%m-%Y') AS dateTaken,
       TIME_FORMAT(a.timeTaken, '%H:%i') AS timeTaken, 
       a.status, 
       a.attendanceID
FROM courses c
LEFT JOIN studentCourses sc ON c.course_id = sc.course_id
LEFT JOIN attendance a ON c.course_id = a.course_id
WHERE c.course_code IN (?) AND (a.matric_num IS NOT NULL OR c.lect_id IS NULL);
 
`;

db.query(query, [course_code], (err, result) => {
  if (err) {
    console.error("Query Error", err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } else {
    if (result.length > 0) {
      res.json({ records: result, success: true });
    } else {
      res.status(401).json({ success: false, message: 'No attendance records found for the specified course_code' });
    }
  }
});
});

//To get the course_id for recording attendance
app.post('/getCourseId', (req, res) => {
  const { matric_num, lect_id, course_code } = req.body;
  
  // Query to retrieve the course_id based on matric_num, lect_id, and course_code
  db.query('SELECT sc.course_id FROM studentcourses sc INNER JOIN courses c ON sc.course_id = c.course_id WHERE sc.matric_num = ? AND c.lect_id = ? AND c.course_code = ?',
    [matric_num, lect_id, course_code],
    (err, result) => {
      if (err) {
        console.error('Error executing the SELECT query:', err);
        res.status(500).send('Error retrieving data from the database');
        res.status(404).send('Student hasnt registered the course');
      } else {
        res.json(result);
      }
    });
});

app.post('/absent', async (req, res) => {
    const { course_id } = req.body;

    // Get the latest "Present" records within the past 5 minutes
    db.query(
      `
      SELECT matric_num
      FROM attendance
      WHERE course_id = ?
        AND Status = 1
        AND timeTaken >= DATE_SUB(NOW(), INTERVAL 5 MINUTE)
      `,
      [course_id],
      (err, result) => {
        if (err) {
          console.error('Error checking attendance:', err);
          return res.status(500).send('Error checking attendance');
        }
    
        if (result.length > 0) {
          console.log("The result is "+result)
          return res.json({ message: 'Attendance updated successfully' });
        } else {
          db.query(
            `
            INSERT INTO attendance (matric_num, course_id, course_code, lect_id, Status)
            SELECT sc.matric_num, c.course_id, c.course_code, c.lect_id, 0
            FROM studentCourses sc
            INNER JOIN courses c ON sc.course_id = c.course_id
            WHERE sc.course_id = ?;
            `,
            [course_id],
            (insertErr, insertResult) => {
              if (insertErr) {
                console.error('Error inserting attendance:', insertErr);
                return res.status(500).send('Error inserting attendance');
              }
              res.json(insertResult);
              console.log("The insertResult is "+insertResult);
            }
          );
        }
      }
    );
}
);

// To update attendance status
app.post('/updateAttendance', (req, res) => {
const { attendanceID, newStatus } = req.body;

if(newStatus == 1 || newStatus == 0){
// Update the status in the database using the provided attendanceID
const sql = 'UPDATE attendance SET Status = ? WHERE attendanceID = ?';
db.query(sql, [newStatus, attendanceID], (err, result) => {
  if (err) {
    console.error("Error updating status:", err);
    res.status(500).send("Error updating status");
  } else {
    res.status(200).send("Status updated successfully");
  }
});
}else{
  res.status(401).send("Invalid status input");
}
});

//To validate password change
app.post('/passwordChange', (req, res) => {
const { matric_num, password } = req.body; // Corrected variable name

// Query the database for user authentication
const query = `
(SELECT 'user' as type, matric_num, password, username FROM users WHERE matric_num = ? AND password = ?)
 UNION 
(SELECT 'lecturer' as type, lect_id as matric_num, lect_password, lect_username FROM lecturers WHERE lect_username = ? AND lect_password = ?)
`;

db.query(query, [matric_num, password, matric_num, password], (err, results) => { // Fixed parameter order
  if (err) {
    console.error('Database query error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } else {
    // Check if a user with matching credentials was found
    if (results.length > 0) {
      const user = results[0];
      res.json({ type: user.type, id: user.matric_num, password: user.password, username: user.username, success: true }); // Corrected response data
    } else {
      res.status(401).json({ success: false, message: 'Invalid matric_num or password' });
    }
  }
});
});

app.post('/changedPassword', (req, res) => {
const { data, password } = req.body;

// Determine if the data is a matric_num or an id
const isMatricNum = /^[0-9]{2}\/[0-9]{4}$/.test(data);
const table = isMatricNum ? 'users' : 'lecturers';
const column = isMatricNum ? 'matric_num' : 'lect_id';
const newPassword = isMatricNum ? 'password' : 'lect_password';

// Update the password in the respective table based on the received data
const sql = `UPDATE ${table} SET ${newPassword} = ? WHERE ${column} = ?`;

db.query(sql, [password, data], (err, result) => {
  if (err) {
    console.error("Error updating password:", err);
    res.status(500).send("Error updating password");
  } else {
    res.status(200).send("Password updated successfully");
  }
});
});

//To set lecturers location
app.post('/updateLocation', (req, res) => {
const { latitude, longitude, lect_id } = req.body;

// Update the password in the respective table based on the received data
const sql = `UPDATE lecturers SET latitude = ?, longitude = ? WHERE lect_id = ?`;

db.query(sql, [latitude, longitude, lect_id], (err, result) => {
  if (err) {
    console.error("Error updating location:", err);
    res.status(500).send("Error updating location");
  } else {
    res.status(200).send("Location updated successfully");
  }
});
});

//To get lecturers location
app.post('/getLocation', (req, res) => { 
const { lect_id } = req.body;
db.query('SELECT latitude,longitude FROM lecturers where lect_id = ?', [lect_id] ,(err, result) => {
  if (err) {
    console.error('Error executing the SELECT query:', err);
    res.status(500).send('Error retrieving data from the database');
  } else {
    res.json(result);
  }
});
});

https.createServer(options, app).listen(5000, () => {
  console.log('Server is running on port 5000 over HTTPS');
});


// To repair the #1034 Index for table 'db' is corrupt; try to repair it error in xampp use;
// REPAIR TABLE mysql.db
// REPAIR TABLE mysql.user

//After getting access denied error
//GRANT ALL PRIVILEGES ON 'db name'.* TO 'busari007'@'localhost' IDENTIFIED BY 'obey4show';
