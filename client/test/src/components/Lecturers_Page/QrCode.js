import React, { useEffect, useState, useRef } from 'react';
import QRCode from 'react-qr-code';
import { useLocation, useNavigate } from 'react-router-dom';
import "../Styles/Home.css";
import { FaArrowLeft, FaBars, FaBell, FaCopyright } from 'react-icons/fa';
import logo from '../Pictures/logo.jpg';
import Axios from 'axios';

const QrCode = () => {
  const navigate = useNavigate();
  const [isOpen, setOpen] = useState(false);
  const sidebarRef = useRef(null);
  const location = useLocation();
  const { lect_username, lect_id } = location.state;
  const [courses, setCourses] = useState([]);
  const [courseCode, setCourseCode] = useState([]);
  const [data, setData] = useState([]);
  const [qrCode, setQRCode] = useState('');
  const [isCodeGenerated, setIsCodeGenerated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attendanceWindow, setAttendanceWindow] = useState(30);
  const [timerId, setTimerId] = useState(null);

  function handleChange(e) {
    let value = e.target.value;
    let [courseName, courseCode] = value.split(" ");
    setData([courseName, courseCode]); 
    setIsCodeGenerated(false);
    setCourseCode(courseCode);
  }  

  function handleQRCode() {
    if (data.length === 0) {
      window.alert("Please register a valid course");
      return;
    }
    const qrData = {
      lect_id: lect_id,
      course_name: data[0] || data.course_name,
      course_code: data[1] || data.course_code
    };

    const qrCodeValue = JSON.stringify(qrData);
    setQRCode(qrCodeValue);
    setIsCodeGenerated(!isCodeGenerated);
    handleAbscence();
  }  

  function handleAbscence() {
    if (isCodeGenerated === false) {
      alert(`Attendance Window set to ${attendanceWindow} seconds`);
      const id = setTimeout(() => {
        setIsCodeGenerated(false);
        console.log(courseCode);
        // Axios.post(`http://${window.location.hostname}:5000/absent`,{
        //   course_code: courseCode
        // }).then((res)=>{
        //   console.log(res);
        // }).catch((err)=>{
        //   console.log(err);
        //   console.log(err.response.data.error)
        //   if(err.response.data.error === "No present records found within the past 5 minutes"){
        //     alert("No student has been marked present within the past 5 minutes");
        //   }
        // });
        alert("Attendance Window Closed");
      }, 30000); // Timer set to 30 seconds
  
       setTimerId(id);
    }
  }

  function handleToggle() {
    setOpen(!isOpen);
  }

  const handleOutsideClick = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function(position) {
        const { latitude, longitude } = position.coords;
        //console.log("Latitude:", latitude, "Longitude:", longitude);
        Axios.post(`http://${window.location.hostname}:5000/updateLocation`,{
          latitude: latitude,
          longitude: longitude,
          lect_id: lect_id
        }).then((res)=>{
          //alert("Location on table updated")
        }).catch((err)=>{
          //alert("Location not updated")
        });
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  },[]);

  useEffect(() => {
    Axios.post(`http://${window.location.hostname}:5000/getLectCourses`, {
      lect_id: lect_id
    })
    .then((response) => {
      console.log(lect_id);
      const initialSelection = [...response.data.courses] ;
      if(courses.length === 0){
        setData([initialSelection[0].course_name, initialSelection[0].course_code]);
        setCourseCode([initialSelection[0].course_code]);
      } else {
        return;
      }
      const receivedCourses = response.data.courses;
      if (receivedCourses && receivedCourses.length > 0) {
        setCourses(receivedCourses); 
       console.log(courseCode);
      } else {
        setCourses([{ course_name: 'No Courses' }]);
      }
    })
    .catch((error) => {
      console.log(error);
      if(error.message === "Request failed with status code 500"){
        alert("Server's Offline");
      setError({message:"Backend Error. Please Refresh"});
      }else if(error.message === "Request failed with status code 401"){
        alert("No Courses found")
        setError({message:"You havent registered any courses. Please register"});
        setLoading(false);
      }else if(error.message === "Network Error"){
        alert("Server's Offline");
        setError({message:"Backend Error. Please Refresh"});
      }
    })
    .finally(() => {
      setLoading(false);
    });
  }, [lect_id, isCodeGenerated,courseCode]);

  useEffect(() => {
    if (courses.length > 0 && courses[0].course_name !== 'No Courses') {
      setData(courses[0]);
    } else {
      setData({ course_name: '', course_code: '' });
    }

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [courses]);

  if (loading) {
    return <div><p style={{marginTop:"19%",fontSize:"40px",fontWeight:'bolder', textAlign:"center"}}>Loading...</p></div>;
  }

  return (
    <div>
      <nav className="Header">
        <FaBars className="icons" onClick={handleToggle} />
        <img className="as_logo" src={logo} alt="logo" />
        <h2 className="page_name">Generator</h2>
        <p className="welcome_text">Welcome, {lect_username || "Guest"}</p>
        <FaBell className="icons" />
      </nav>
      <div className={`sidebar ${isOpen ? 'open' : 'close'}`} ref={sidebarRef}>
        <div id="sidebarHeader">
          <FaArrowLeft style={{ color: 'rgb(65,65,65)' }} onClick={handleToggle} className="icons" />
          <h2>UAS</h2>
        </div>
        <ul>
          <li><button style={{ marginLeft: '35.5%' }} className="sidebar-links" onClick={() => { navigate('/lectHome', { state: { lect_username, lect_id } }) }}>Home</button></li>
          <li><button className="sidebar-links" onClick={() => { navigate('/lectCourses', { state: { lect_username, lect_id } }) }}>Course List</button></li>
          <li><button className="sidebar-links" onClick={() => { navigate('/lectAddCourses', { state: { lect_username, lect_id } }) }}>Add Course</button></li>
          <li><a style={{ marginLeft: '31.5%' }} className="sidebar_content" href="/lectSignIn">Log Out</a></li>
        </ul>
        <FaCopyright style={{ position: "absolute", bottom: 5, left: 5, fontSize: 30, color: '#2a2aaf' }} />
      </div>
      <div className="qr_courses">
        <label className='codeTitle'>Pick a course:</label>
        <select name="data" onChange={(e) => handleChange(e)}>
          {courses && courses.map((course) => (
            <option key={course.course_code || 1} value={`${course.course_name || ''} ${course.course_code || ''}`}>
              {course.course_name} {course.course_code}
            </option>
          ))}
        </select>
        {error && <div style={{color: "red"}}>{error.message}</div>}
      </div>
      {isCodeGenerated &&
        <QRCode className={`qrCode`} value={qrCode} />
      }
      {!error && <button
        style={{ marginTop: "-5%" }}
        onClick={handleQRCode}
        className={`qrButton ${isCodeGenerated ? 'after' : 'before'}`}
      >
        {isCodeGenerated ? 'X': 'Generate'}
      </button>}
    </div>
  );
}

export default QrCode;
