import "../Styles/Home.css";
import { FaArrowLeft, FaBars, FaBell, FaCopyright } from 'react-icons/fa';
import { useState, useEffect, useRef } from "react";
import logo from '../Pictures/logo.jpg';


import React from "react";

const Home = (props) =>{
 
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
    <p className="welcome_text">Welcome, {"busari.007"}{props.username}</p>
    <FaBell className="icons"/>
    </nav> 
    <div className={`sidebar ${isOpen ? 'open' : 'close'}`} ref={sidebarRef}>
      <div id="sidebarHeader">
      <FaArrowLeft style={{color:'rgb(65,65,65)'}} onClick={handleToggle} className="icons"/>
      <h2>UAS</h2>
     </div>
      <ul>
        <li><a className="sidebar_content" href="/courses">Course List</a></li>
        <li><a className="sidebar_content" href="/addCourses">Add Course</a></li>
        <li><a style={{marginLeft:'31.5%'}} className="sidebar_content" href="/">Log Out</a></li>    
      </ul>
      <FaCopyright style={{position:"absolute",bottom:5,left:5, fontSize:30,color:'#2a2aaf'}}/>
    </div>
        {/*<button onClick={() => console.log(props.username)}>Click</button>*/}
    </div>
    );
  }

export default Home;
