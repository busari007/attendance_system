import React,{ useState,useEffect,useRef } from "react";
import { FaArrowLeft, FaBars, FaBell, FaCopyright } from 'react-icons/fa';
import logo from "../Pictures/logo.jpg";
import  Axios from "axios";

const AddCourses = (props)=> {

    const [isOpen, setOpen] = useState(false);
    const sidebarRef = useRef(null); // A ref is a property that can hold a reference to a DOM element or a React component instance
    const [state,setState] = useState({
      session:"",
      course_name:"",
      course_code:""
    });

  function handleSubmit(e){
    e.preventDefault();
    Axios.post("http://localhost:5000/courses",{
      session:state.session,
      course_name:state.course_name,
      course_code:state.course_code
    }).then((result)=>{
      console.log(result);
    }).catch((err)=>{
      console.log(err);
    });
  }

    function handleChange(e){
     let name = e.target.id;
     let value = e.target.value;
     setState((prevState) => ({
      ...prevState,              //spreads the existing state and update only the property corresponding to the changed input field.
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
        <li><a className="sidebar_content" href="/courses">Course List</a></li>
        <li><a style={{marginLeft:'32.5%'}} className="sidebar_content" href="/">Log Out</a></li>      
      </ul>
      <FaCopyright style={{position:"absolute",bottom:5,left:5, fontSize:30,color:'#2a2aaf'}}/>
    </div>
     
    <h1 id="text" className={`page_content ${isOpen? 'shift':''}`}>Here</h1>
    <div className="course_container">
      <label className="courseContainerHeader">What session are you in?</label>
      <input type="text" id="session" onChange={(e)=>handleChange(e)}/>
    </div>
    <div className="course_container">
      <label className="courseContainerHeader">Enter your course names and codes</label>
      <div id="course_container_content">
      <input type="text" id="course_name" placeholder="Course Name" onChange={(e)=>handleChange(e)}/>
      <input type="text" id="course_code" placeholder="Course Code" onChange={(e)=>handleChange(e)}/>
      </div>
      <button className="submit" onClick={(e)=>handleSubmit(e)}>Submit</button>
      <h1 style={{color:'#0000EE', visibility:"hidden"}}>Go to Course List to check list of courses</h1>
    </div>
    </div>
   );
}

export default AddCourses;