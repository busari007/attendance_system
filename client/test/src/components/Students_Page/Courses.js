import React, { useState, useEffect, useRef } from 'react';
import { FaArrowLeft, FaBars, FaBell, FaCopyright } from 'react-icons/fa';
import logo from '../Pictures/logo.jpg';
import  Axios  from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

function Courses(props){
    const location = useLocation();
    const { username, matric_num } = location.state;  // Recieves the username and matric number 
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [isOpen, setOpen] = useState(false);
    const sidebarRef = useRef(null); // A ref is a property that can hold a reference to a DOM element or a React component instance
    
    function handleToggle(){
        setOpen(!isOpen);
    }
   

    const handleOutsideClick = (event) => {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
          setOpen(false);
        }
      };
      

    useEffect(() => {
        Axios.post("http://localhost:5000/getCourses",{
          matric_num: matric_num   //uses the matric number to filter the courses table to send only courses with the matric numbers value(its a foreign key in the db)
        })
        .then((response) => {
          // Set the courses state with the fetched data
          setCourses(response.data.courses);
          console.log(response);
        })
        .catch((error) => {
          console.error("Error fetching courses:", error);
        });

        document.addEventListener('mousedown', handleOutsideClick);
      
        return () => {
          document.removeEventListener('mousedown', handleOutsideClick);
        };
      }, [matric_num]);

   return(
    <div>
         <nav className="Header">
      <FaBars className="icons" onClick={handleToggle} />
      <img className="as_logo" src={logo} alt="logo"/>
      <h2 className="page_name">Course List</h2>
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
        <li><button className="sidebar-links" onClick={()=>{navigate('/addCourses', {state:{ username, matric_num }})}}>Add Courses</button></li>
        <li><button style={{marginRight:'29.5%'}} className="sidebar-links" onClick={()=>{navigate('/qrCodeScanner', {state:{ username, matric_num }})}}>QRCode Scanner</button></li> 
        <li><a style={{marginLeft:'32.5%'}} className="sidebar_content" href="/">Log Out</a></li>      
      </ul>
      <FaCopyright style={{position:"absolute",bottom:5,left:5, fontSize:30,color:'#2a2aaf'}}/>
    </div>

    <div className="course_container" style={{ marginTop:'2%', border:'none', fontWeight:'600', fontSize:'x-large'}}>
    <ul>
        {courses.map((course) => (  //displays the courses fetched
          <li style={{margin:'2%'}}>
            {course.course_name} - {course.course_code}
          </li>
        ))}
      </ul>
      </div>
    </div>
   );
}

export default Courses;