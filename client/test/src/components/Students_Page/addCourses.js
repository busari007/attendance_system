import React,{ useState,useEffect,useRef } from "react";
import { FaArrowLeft, FaBars, FaBell, FaCopyright } from 'react-icons/fa';
import logo from "../Pictures/logo.jpg";
import  Axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const AddCourses = (props)=> {
   const location = useLocation();
   // Retrieve username and matric_num from local storage
   const storedUsername = localStorage.getItem('username');
   const storedMatricNum = localStorage.getItem('matric_num');
   const { username = storedUsername || "Guest", matric_num = storedMatricNum || "" } = location.state || {};
   const navigate = useNavigate();
   const [isOpen, setOpen] = useState(false);
   const sidebarRef = useRef(null); 
   const [state,setState] = useState({
      course_name:"",
      course_code:"",
      department:"",
      session:"",
      course_id:""
});
   const [courses,setCourses] = useState([]);

 function handleSubmit(e){ 
  e.preventDefault();
    const parts = state.course_id.split(" ");
    const courseID = parts.pop(); // Extract the last part as the course ID
    const courseCode = parts.pop(); // Extract the second last part as the course code
    const courseName = parts.join(" "); // Join the remaining parts as the course name

    console.log(courseName, courseCode, courseID);
    Axios.post(`https://${window.location.hostname}:5000/studentCourses`,{
      course_id: courseID || courses[0].course_id,
      matric_num: matric_num  //gotten from ./home
    }).then((result)=>{
      console.log(result);
      if(result.status === 200){
        window.alert(`Successfully registered ${courseName || courses[0].course_name}`);
        window.location.reload();  //reloads page after courses have been sent
      }
    }).catch((err)=>{
      console.log(err);
      if (err.response.data === "Course already exists for the specified matric_num or lect_id"){
        alert("You have already registered this course");
      }else if(err.message === "Network Error"){
        alert("Server's Offline");
      }else if(err.message === "Request failed with status code 500"){
        alert("Server Error");
      }else if(err.message === 'Request failed with status code 409'){
        alert("You have already registered this course");
      }
    });
  }

    function handleChange(e){
      const { id, value } = e.target;
      setState(prevState => ({
        ...prevState,
        [id]: value,
      }));
    }

    function handleToggle(){
        setOpen(!isOpen);
    }
   

    const handleOutsideClick = (event) => {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
          setOpen(false);
        }
      };
      

    useEffect(() => {
      // Save username and matric_num to local storage
       localStorage.setItem('username', username);
       localStorage.setItem('matric_num', matric_num);
        Axios.get(`https://${window.location.hostname}:5000/courses`).then((res)=>{
           console.log(res);
           setCourses(res.data);
           console.log(courses);
           console.log("The course_id is " + courses[0].course_id);
        }).catch((err)=>{
            console.log(err);
            if(err.message === "Network Error"){
              alert("Server's Offline");
            }else if(err.message === "Request failed with status code 500"){
              alert("Server Error");
              alert("Can't recieve the courses");
            }
        });
        document.addEventListener('mousedown', handleOutsideClick);
      
        return () => {
          document.removeEventListener('mousedown', handleOutsideClick);
        };
      }, [matric_num,username]);

   return(
    <div>
         <nav className="Header">
      <FaBars className="icons" onClick={handleToggle} />
      <img className="as_logo" src={logo} alt="logo"/>
      <h2 className="page_name">Add Courses</h2>
    <p className="welcome_text">Welcome, {username || "Guest"}</p>
    <FaBell className="icons"/>
    </nav> 
    <div className={`sidebar ${isOpen ? 'open' : 'close'}`} ref={sidebarRef}>
      <div id="sidebarHeader">
      <FaArrowLeft style={{color:'rgb(65,65,65)'}} onClick={handleToggle} className="icons"/>
       <h2>UAS</h2>
      </div>
      <ul>
        <li><button style={{marginLeft:'35.5%'}} className="sidebar-links" onClick={()=>{navigate('/home', {state:{ username, matric_num }})}}>Home</button></li>
        <li><button className="sidebar-links" onClick={()=>{navigate('/courses', {state:{ username, matric_num }})}}>Course List</button></li>  {/*Passes the username and matric_num into ./courses as state in the navigate function */}
        <li><button style={{marginRight:'29.5%'}} className="sidebar-links" onClick={()=>{navigate('/qrCodeScanner', {state:{ username, matric_num }})}}>QRCode Scanner</button></li> 
        <li><a style={{marginLeft:'32.5%'}} className="sidebar_content" href="/signIn">Log Out</a></li>      
      </ul>
      <FaCopyright style={{position:"absolute",bottom:5,left:5, fontSize:30,color:'#2a2aaf'}}/>
    </div>
     
    {/* To test sliding into visibility transition <h1 id="text" className={`page_content ${isOpen? 'shift':''}`}>Here</h1> */}
    <div style={{marginBottom:'2%', marginTop:'2.5%'}} className="course_container">
      <label className="course_container_header">Enter your Session</label>
      <div className="course_container_content">
      <select onChange={(e) => handleChange(e)} id='session'>
      {courses && courses.map((course) => (
            <option key={course.course_id || 1} value={`${course.session || ''}`}>
             {course.session}
            </option>
          ))}
      </select>
      </div>
    </div>
    <div style={{marginBottom:'2%'}} className="course_container">
    <label className="course_container_header">Enter your Department</label>
      <div className="course_container_content">
      <select onChange={(e) => handleChange(e)} id='department'>
      {courses && courses.map((course) => (
            <option key={course.course_id || 1} value={`${course.department || ''}`}>
             {course.department}
            </option>
          ))}
      </select>
     </div>
    </div>
    <div style={{marginTop:'3%'}} className="course_container">
      <label className="course_container_header">Course Code and Code</label>
      <div className="course_container_content">
      <select onChange={(e) => handleChange(e)} id='course_id'>
      {courses && courses.map((course) => (
            <option key={course.course_id || 1} value={`${course.course_code || ''} ${course.course_name || ''} ${course.course_id || ''}`}>
             {course.course_name} {course.course_code}
            </option>
          ))}
      </select>
      </div> 
      </div>
    <button id="course_submit" className="submit" disabled={false} onClick={(e)=>handleSubmit(e)}>Submit</button>
    </div>
   );
}

export default AddCourses;

