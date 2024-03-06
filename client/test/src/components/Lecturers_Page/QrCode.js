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
  const [courseCode, setCourseCode] = useState("");
  const [data, setData] = useState();
  const [qrCode, setQRCode] = useState('');
  const [isCodeGenerated, setIsCodeGenerated] = useState(false);
  const [timerId, setTimerId] = useState(null);

  function handleChange(e) {
    let value = e.target.value;
    let [courseName, courseCode] = value.split(" ");
    setData({ course_name: courseName, course_code: courseCode });
    setIsCodeGenerated(false);
    setCourseCode(courseCode);
  }

  function handleQRCode() {
    if (!data || !data.course_name || !data.course_code) {
      window.alert("Please register a valid course");
      return;
    }
  
    const qrData = {
      lect_id: lect_id, // Include lect_id
      course_name: data.course_name,
      course_code: data.course_code
    };
  
    const qrCodeValue = JSON.stringify(qrData); // Convert to JSON string
    setQRCode(qrCodeValue);
    setIsCodeGenerated(!isCodeGenerated);
    clearTimeout(timerId); // Clear existing timer
    handleAbscence();
  }
  

  function handleAbscence() {
    // if (isCodeGenerated === false) {
    //   const id = setTimeout(() => {
    //     setIsCodeGenerated(false);
    //     Axios.post(`https://vercel-backend-test-azure.vercel.app/absent`,{
    //       course_code: courseCode
    //     }).then((res)=>{
    //       console.log(res);
    //     }).catch((err)=>{
    //       console.log(err);
    //     });
    //     alert("Attendance Window Closed");
    //   }, 30000); // Timer set to 10 seconds
  
    //    setTimerId(id);
    // }
  }

  function handleToggle() {
    setOpen(!isOpen);
  }

  const handleOutsideClick = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setOpen(false);
    }
  };
useEffect(()=>{
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(function(position) {
        const { latitude, longitude } = position.coords;
         console.log("Latitude:", latitude, "Longitude:", longitude);
         Axios.post('https://vercel-backend-test-azure.vercel.app/updateLocation',{
          latitude: latitude,
          longitude: longitude,
          lect_id: lect_id
        }).then((res)=>{
            alert("Location on table updated")
        }).catch((err)=>{
            alert("Location not updated")
        });
    });
} else {
    console.log("Geolocation is not supported by this browser.");
}
},[]);

  useEffect(() => {
    Axios.post(`https://vercel-backend-test-azure.vercel.app/getLectCourses`, {
      lect_id: lect_id
    })
      .then((response) => {
        const receivedCourses = response.data.courses;
        if (receivedCourses && receivedCourses.length > 0) {
          setCourses(receivedCourses);

        } else {
          setCourses([{ course_name: 'No Courses' }]);
        }
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
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
      </div>
      {isCodeGenerated &&
        <QRCode className={`qrCode`} value={qrCode} />
      }
      <button
        style={{ marginTop: "-5%" }}
        onClick={handleQRCode}
        className={`qrButton ${isCodeGenerated ? 'after' : 'before'}`}
      >
        {isCodeGenerated ? 'X' : 'Generate'}
      </button>
    </div>
  );
}

export default QrCode;


