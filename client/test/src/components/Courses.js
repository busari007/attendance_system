import React, { useState, useEffect, useRef } from 'react';
import { FaArrowLeft, FaBars, FaBell, FaCopyright } from 'react-icons/fa';
import logo from "../Pictures/logo.jpg";
import  Axios  from 'axios';

function Courses(props){
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
        Axios.get("http://localhost:5000/courses")
        .then((response) => {
          // Set the courses state with the fetched data
          setCourses(response.data);
          console.log(response);
        })
        .catch((error) => {
          console.error("Error fetching courses:", error);
        });

        document.addEventListener('mousedown', handleOutsideClick);
      
        return () => {
          document.removeEventListener('mousedown', handleOutsideClick);
        };
      }, []);

   return(
    <div>
         <nav className="Header">
      <FaBars className="icons" onClick={handleToggle} />
      <img className="as_logo" src={logo} alt="logo"/>
      <h2 className="page_name">Course List</h2>
    <p className="welcome_text">Welcome, {"busari.007"}{props.username}</p>
    <FaBell className="icons"/>
    </nav> 
    <div className={`sidebar ${isOpen ? 'open' : 'close'}`} ref={sidebarRef}>
      <div id="sidebarHeader">
      <FaArrowLeft style={{color:'rgb(65,65,65)'}} onClick={handleToggle} className="icons"/>
       <h2>UAS</h2>
      </div>
      <ul>
        <li><a style={{marginLeft:'35.5%'}} className="sidebar_content" href="/home">Home</a></li>
        <li><a className="sidebar_content" href="/addCourses">Add Courses</a></li>
        <li><a style={{marginLeft:'32.5%'}} className="sidebar_content" href="/">Log Out</a></li>      
      </ul>
      <FaCopyright style={{position:"absolute",bottom:5,left:5, fontSize:30,color:'#2a2aaf'}}/>
    </div>

    <div className="course_container" style={{ marginTop:'2%', border:'none', fontWeight:'600', fontSize:'x-large'}}>
    <ul>
        {courses.map((course) => (
          <li style={{margin:'2%'}}>
            {course.course_name} - {course.course_code}
          </li>
        ))}
      </ul>
      <h2>{props.name}</h2>
      </div>
    </div>
   );
}

export default Courses;