import React, { useState, useEffect, useRef } from 'react';
import { FaArrowLeft, FaBars, FaBell, FaCopyright } from 'react-icons/fa';
import logo from '../Pictures/logo.jpg';
import  Axios  from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

function LectCourses(props){
    const location = useLocation();
    const { lect_username, lect_id } = location.state;  // Recieves the username and matric number 
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [isOpen, setOpen] = useState(false);
    const sidebarRef = useRef(null); // A ref is a property that can hold a reference to a DOM element or a React component instance
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    function handleToggle(){
        setOpen(!isOpen);
    }
   

    const handleOutsideClick = (event) => {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
          setOpen(false);
        }
      };
      
    function handleDelete(course_name,course_code,course_id){
      console.log(course_name,course_code,course_id);
       Axios.post(`http://${window.location.hostname}:5000/deleteLectCourses`,{
          course_id:course_id,
          course_code: course_code,
          course_name: course_name 
       }).then((result)=>{
          console.log(result);
          alert(`${course_name} successfully deleted`);
          setCourses(prevCourses => prevCourses.filter(course => course.course_id !== course_id));
          Axios.post(`http://${window.location.hostname}:5000/deleteCourses`,{
            course_id: course_id
          }).then((res)=>{ console.log("Related students data deleted")}).catch((err)=>{console.log(err); console.log("Students' data could'nt be deleted")});
       }).catch((error)=>{
          console.log(error);
          if(error.message === "Network error"){
              alert("The server's Offline");
          }else{
          alert("Error deleting course");
          }
       });
    }

      
    useEffect(() => {
        Axios.post(`http://${window.location.hostname}:5000/getLectCourses`,{
          lect_id: lect_id  //uses the matric number to filter the courses table to send only courses with the matric numbers value(its a foreign key in the db)
        })
        .then((response) => {
          // Set the courses state with the fetched data
          setCourses(response.data.courses);
          console.log(response);
          setLoading(false);
          console.log(courses);
        })
        .catch((error) => {
          console.error("Error fetching courses:", error);  
          console.log(error.response.data.message);
          if(error.message === "Request failed with status code 500"){
            alert("Internal Server Error");
            setError({message:"Backend Error. Please Refresh"});
            }else if(error.message === "Request failed with status code 401"){
              alert("No courses have been registered");
              setError({message:"You havent registered any courses. Please Register"});
              setLoading(false);
            }else if(error.message === "Network Error"){
              alert("Server's Offline");
              setError({message:"Backend Error. Please Refresh"});
            }
        });

        document.addEventListener('mousedown', handleOutsideClick);
      
        return () => {
          document.removeEventListener('mousedown', handleOutsideClick);
        };
      }, [lect_id]);

      if (loading) {
        return <div><p style={{marginTop:"19%",fontSize:"40px",fontWeight:'bolder', textAlign:"center"}}>Loading...</p></div>;
      }

   return(
    <div>
         <nav className="Header">
      <FaBars className="icons" onClick={handleToggle} />
      <img className="as_logo" src={logo} alt="logo"/>
      <h2 className="page_name">Course List</h2>
    <p className="welcome_text">Welcome, {lect_username || "Guest"}</p>
    <FaBell className="icons"/>
    </nav> 
    <div className={`sidebar ${isOpen ? 'open' : 'close'}`} ref={sidebarRef}>
      <div id="sidebarHeader">
      <FaArrowLeft style={{color:'rgb(65,65,65)'}} onClick={handleToggle} className="icons"/>
       <h2>UAS</h2>
      </div>
      <ul>
        <li><button style={{marginLeft:'35.5%'}} className="sidebar-links" onClick={()=>{navigate('/lectHome', {state:{ lect_username, lect_id }})}}>Home</button></li>
        <li><button className="sidebar-links" onClick={()=>{navigate('/lectAddCourses', {state:{ lect_username, lect_id }})}}>Add Courses</button></li>
        <li><button style={{marginRight:'29.5%'}} className="sidebar-links" onClick={()=>{navigate('/qrCode', {state:{ lect_username, lect_id }})}}>QRCode Generator</button></li> 
        <li><a style={{marginLeft:'32.5%'}} className="sidebar_content" href="/lectSignIn">Log Out</a></li>      
      </ul>
      <FaCopyright style={{position:"absolute",bottom:5,left:5, fontSize:30,color:'#2a2aaf'}}/>
    </div>

    {error ? <h2 style={{color: "rgb(255, 35, 35)", textAlign:"center"}}>{error.message}</h2> : <div className="course_container" style={{ marginTop:'2%', border:'none', fontWeight:'600', fontSize:'x-large'}}>
    <ul>
        {courses.map((course) => (  //displays the courses fetched
          <li key={course.course_id} style={{margin:'2%', marginTop:"3%"}}>
            {course.course_name} - {course.course_code}
            <button style={{ textAlign:"center"}} className="delete" key={course.course_id} onClick={()=>handleDelete(course.course_name,course.course_code,course.course_id)}>X</button>
          </li>
        ))}
      </ul>
      </div> }
    </div>
   );
}

export default LectCourses;