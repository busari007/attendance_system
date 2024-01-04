import "../Styles/Home.css";
import { FaArrowLeft, FaBars, FaBell, FaCopyright } from 'react-icons/fa';
import { useState, useEffect, useRef } from "react";
import logo from '../Pictures/logo.jpg';
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Home (){
  const location = useLocation();
  const { username, matric_num } = location.state;  //To pass username and matric num into components on different routes (React router v6)
  const navigate = useNavigate();  //To navigate through routes
 const [isOpen, setOpen] = useState(false); //To set slidebar to appear or disappear
 const sidebarRef = useRef(null); // A ref is a property that can hold a reference to a DOM element or a React component instance

 function handleToggle(){
     setOpen(!isOpen);
 }

 const handleOutsideClick = (event) => {
  if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {  //To make sidebar close when a place outside of the sidebar is clicked
    setOpen(false);
  }
};

useEffect(() => {  //To handle the click event that closes the sidebar outside the sidebar
  document.addEventListener('mousedown', handleOutsideClick);   

  return () => {
    document.removeEventListener('mousedown', handleOutsideClick);
  };
}, []);

    return (
      <div>
        <nav className="Header">
      <FaBars className="icons" onClick={handleToggle} />
      <img className="as_logo" src={logo} alt="logo"/>
      <h2 className="page_name">Home</h2>
    <p className="welcome_text">Welcome, {username}</p>
    <FaBell className="icons"/>
    </nav> 
    <div className={`sidebar ${isOpen ? 'open' : 'close'}`} ref={sidebarRef}>
      <div id="sidebarHeader">
      <FaArrowLeft style={{color:'rgb(65,65,65)'}} onClick={handleToggle} className="icons"/>
      <h2>UAS</h2>
     </div>
      <ul>
        <li><button className="sidebar-links" onClick={()=>{navigate('/courses', {state:{ username, matric_num }})}}>Course List</button></li>   {/*username and matric_num are passed into ./courses and ./addCourses as state in the navigate function*/}
        <li><button className="sidebar-links" onClick={()=>{navigate('/addCourses', {state:{ username, matric_num }})}}>Add Course</button></li>
        <li><a style={{marginLeft:'31.5%'}} className="sidebar_content" href="/">Log Out</a></li>    
      </ul>
      <FaCopyright style={{position:"absolute",bottom:5,left:5, fontSize:30,color:'#2a2aaf'}}/>
    </div>
    </div>
    );
  }

export default Home;
