import "../Styles/Home.css";
import { FaArrowLeft, FaBars, FaBell, FaCopyright } from 'react-icons/fa';
import { useState, useEffect, useRef } from "react";
import logo from '../Pictures/logo.jpg';
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import  Axios  from "axios";

function LectHome(){
  const location = useLocation();
  const [lect_id, setLectId] = useState();
  const { lect_username } = location.state;  //To pass username and matric num into components on different routes (React router v6)
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
    Axios.post('https://vercel-backend-test-azure.vercel.app/lectId',{
        lect_username: lect_username
    }).then(({ data: { lect_id } }) => {
        setLectId(lect_id);
        console.log(lect_id);
      }).catch((err)=>{
         console.log(err);
    });
  document.addEventListener('mousedown', handleOutsideClick);   

  return () => {
    document.removeEventListener('mousedown', handleOutsideClick);
  };
}, [lect_username]); 

    return (
      <div>
        <nav className="Header">
      <FaBars className="icons" onClick={handleToggle} />
      <img className="as_logo" src={logo} alt="logo"/>
      <h2 className="page_name">Home</h2>
    <p className="welcome_text">Welcome, {lect_username || "Guest"}</p>
    <FaBell className="icons"/>
    </nav> 
    <div className={`sidebar ${isOpen ? 'open' : 'close'}`} ref={sidebarRef}>
      <div id="sidebarHeader">
      <FaArrowLeft style={{color:'rgb(65,65,65)'}} onClick={handleToggle} className="icons"/>
      <h2>UAS</h2>
     </div>
      <ul>
        <li><button style={{marginLeft:'33.5%'}}  className="sidebar-links" onClick={()=>{navigate('/lectCourses', {state:{ lect_username,lect_id }})}}>Courses</button></li>   {/* username and lect_id are passed into ./courses and ./addCourses as state in the navigate function*/}
        <li><button className="sidebar-links" onClick={()=>{navigate('/lectAddCourses', {state:{ lect_username,lect_id }})}}>Add Course</button></li>
        <li><button style={{marginRight:'29.5%'}} className="sidebar-links" onClick={()=>{navigate('/qrCode', {state:{ lect_username,lect_id }})}}>QRCode Generator</button></li> 
        <li><a style={{marginLeft:'33.5%'}} className="sidebar_content" href="/lectSignIn">Log Out</a></li>    
      </ul>
      <FaCopyright style={{position:"absolute",bottom:5,left:5, fontSize:30,color:'#2a2aaf'}}/>
    </div>
    </div>
    );
  }

export default LectHome;
