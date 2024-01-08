import React,{ useState,useEffect,useRef } from "react";
import { FaArrowLeft, FaBars, FaBell, FaCopyright } from 'react-icons/fa';
import logo from "../Pictures/logo.jpg";
import  Axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const AddCourses = (props)=> {
   const location = useLocation();
   const { username, matric_num } = location.state;
   const navigate = useNavigate();
   const [isOpen, setOpen] = useState(false);
   const sidebarRef = useRef(null); 
   const [state,setState] = useState({
      session:"",
      department:"",
      course_name:"",
      course_code:""
    });

 function handleSubmit(e){
    e.preventDefault();
    Axios.post("http://localhost:5000/courses",{
      session:state.session,
      course_name:state.course_name,
      course_code:state.course_code,
      department:state.department,
      matric_num: matric_num  //gotten from ./home
    }).then((result)=>{
      console.log(result);
      if(result.status === 200){
        window.alert("Successfully registered courses");
        window.location.reload();  //reloads page after courses have been sent
      }
    }).catch((err)=>{
      console.log(err);
      if(err){
        window.alert("Error please try again");
      }
    });
  }

    function handleChange(e){
     let name = e.target.id;
     let value = e.target.value;
     setState((prevState) => ({
      ...prevState,              
      [name]: value
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
      <h2 className="page_name">Add Courses</h2>
    <p className="welcome_text">Welcome, {username}</p>
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
        <li><button style={{marginRight:'29.5%'}} className="sidebar-links" onClick={()=>{navigate('/qrCode', {state:{ username, matric_num }})}}>QRCode Generator</button></li> 
        <li><a style={{marginLeft:'32.5%'}} className="sidebar_content" href="/">Log Out</a></li>      
      </ul>
      <FaCopyright style={{position:"absolute",bottom:5,left:5, fontSize:30,color:'#2a2aaf'}}/>
    </div>
     
    {/* To test sliding into visibility transition <h1 id="text" className={`page_content ${isOpen? 'shift':''}`}>Here</h1> */}
    <div style={{marginBottom:'2%', marginTop:'2.5%'}} className="course_container">
      <label className="course_container_header">Enter your Session</label>
      <div className="course_container_content">
      <input style={{marginBottom:"5%", marginTop:'-1%'}} type="text" id="session" placeholder="e.g. 2024/2025" onChange={(e)=>handleChange(e)}/>
      </div>
    </div>
    <div style={{marginBottom:'2%'}} className="course_container">
    <label className="course_container_header">Enter your Department</label>
      <div className="course_container_content">
      <input style={{marginBottom:"5%", marginTop:'-1%'}} type="text" id="department" placeholder="Department" onChange={(e)=>handleChange(e)}/>
     </div>
    </div>
    <div className="course_container">
      <label className="course_container_header">Enter your course names and codes</label>
      <div className="course_container_content">
      <input type="text" id="course_name" placeholder="Course Name" onChange={(e)=>handleChange(e)}/>
      <input type="text" id="course_code" placeholder="Course Code" onChange={(e)=>handleChange(e)}/>
      </div>
      <h1 style={{color:'#0000EE', visibility:"hidden"}}>Go to Course List to check list of courses</h1>
    </div>
    <button id="course_submit" className="submit" onClick={(e)=>handleSubmit(e)}>Submit</button>
    </div>
   );
}

export default AddCourses;