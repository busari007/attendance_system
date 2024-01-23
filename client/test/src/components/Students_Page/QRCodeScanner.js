import React, { useState, useEffect, useRef } from 'react';
import { FaArrowLeft, FaBars, FaBell, FaCopyright } from 'react-icons/fa';
import QrReader from 'react-web-qr-reader';
import logo from '../Pictures/logo.jpg';
import { useLocation, useNavigate } from 'react-router-dom';
import Axios from 'axios';

function QRCodeScanner(props){
    const location = useLocation();
    const { username, matric_num } = location.state;  // Recieves the username and matric number 
    const navigate = useNavigate();
    const delay = 2000;
    const previewStyle = {
      height: 240,
      width: 320,
    };
    const [display, setDisplay] = useState(false);
    const [result, setResult] = useState([]);
    //const [courses, setCourses] = useState([]);
    const [isOpen, setOpen] = useState(false);
    const sidebarRef = useRef(null); // A ref is a property that can hold a reference to a DOM element or a React component instance
    const [isCodeGenerated, setIsCodeGenerated] = useState(false);
    
    const handleDisplay = () =>{
        setDisplay(!display);
        setIsCodeGenerated(true);
    }

    const handleScan = (res) => {
        if (res) {
          setResult(res);
          console.log(res.data);
        }
      };
    
      const handleError = (error) => {
        console.log(error);
      };
    

    function handleToggle(){
        setOpen(!isOpen);
    }
   

    const handleOutsideClick = (event) => {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
          setOpen(false);
        }
      };
      

    useEffect(() => {
       Axios.post('https://vercel-backend-test-azure.vercel.app/getCourseId',{
        course_code: result.data, 
       matric_num: matric_num
       }).then((res)=>{
        const { course_id } = res.data[0];
        Axios.post('https://vercel-backend-test-azure.vercel.app/attendance',{
          matric_num: matric_num,
          course_id: course_id,
          Status: 'Present'
        }).then((res)=>{
          window.alert('Attendance successfully recorded');
          console.log(res);
        }).catch((err)=>{
          console.log(err);
        })
       }).catch((err)=>{
        console.log(err);
       })

        document.addEventListener('mousedown', handleOutsideClick);
      
        return () => {
          document.removeEventListener('mousedown', handleOutsideClick);
        };
      }, [matric_num, result.data]);

   return(
    <div>
         <nav className="Header">
      <FaBars className="icons" onClick={handleToggle} />
      <img className="as_logo" src={logo} alt="logo"/>
      <h2 className="page_name">QRCode Scanner</h2>
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
        <li><button style={{marginRight:'29.5%'}} className="sidebar-links" onClick={()=>{navigate('/courses', {state:{ username, matric_num }})}}>Course List</button></li>
        <li><button className="sidebar-links" onClick={()=>{navigate('/addCourses', {state:{ username, matric_num }})}}>Add Courses</button></li> 
        <li><a style={{marginLeft:'32.5%'}} className="sidebar_content" href="/">Log Out</a></li>      
      </ul>
      <FaCopyright style={{position:"absolute",bottom:5,left:5, fontSize:30,color:'#2a2aaf'}}/>
    </div>

    <div className="course_container" style={{ marginTop:'2%', marginLeft:'39.7%', border:'none', fontWeight:'600', fontSize:'x-large'}}>
    {display && <QrReader
       className='qrReader'
        delay={delay}
        style={previewStyle}
        onError={handleError}
        onScan={handleScan}
      /> }
      <button
        onClick={handleDisplay}
        style={{marginTop:'18%',marginLeft:'17.5%'}}
        className={`qrButton ${isCodeGenerated ? 'after' : 'before'}`}
      >
        Display
      </button>
      </div>
    </div>
   );
}

export default QRCodeScanner;
