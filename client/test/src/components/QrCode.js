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
  const { username, matric_num } = location.state;
  const [courses, setCourses] = useState([]);
  const [data, setData] = useState();
  const [qrCode, setQRCode] = useState('');
  const [isCodeGenerated, setIsCodeGenerated] = useState(false);

  function handleChange(e) {
    let value = e.target.value;
    setData(value);
  }

  function handleQRCode() {
    setQRCode(data.toString());
    setIsCodeGenerated(true);
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
    Axios.post("http://localhost:5000/getCourses", {
      matric_num: matric_num
    })
      .then((response) => {
        setCourses(response.data.courses);
        console.log(response);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
      });
   
  }, [matric_num]);

  useEffect(()=>{
    setData(courses[0]);
    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  },[courses]);

  return (
    <div>
      <nav className="Header">
        <FaBars className="icons" onClick={handleToggle} />
        <img className="as_logo" src={logo} alt="logo" />
        <h2 className="page_name">QRCode Generator</h2>
        <p className="welcome_text">Welcome, {username}</p>
        <FaBell className="icons" />
      </nav>
      <div className={`sidebar ${isOpen ? 'open' : 'close'}`} ref={sidebarRef}>
        <div id="sidebarHeader">
          <FaArrowLeft style={{ color: 'rgb(65,65,65)' }} onClick={handleToggle} className="icons" />
          <h2>UAS</h2>
        </div>
        <ul>
          <li><button style={{ marginLeft: '35.5%' }} className="sidebar-links" onClick={() => { navigate('/home', { state: { username, matric_num } }) }}>Home</button></li>
          <li><button className="sidebar-links" onClick={() => { navigate('/courses', { state: { username, matric_num } }) }}>Course List</button></li>
          <li><button className="sidebar-links" onClick={() => { navigate('/addCourses', { state: { username, matric_num } }) }}>Add Course</button></li>
          <li><a style={{ marginLeft: '31.5%' }} className="sidebar_content" href="/">Log Out</a></li>
        </ul>
        <FaCopyright style={{ position: "absolute", bottom: 5, left: 5, fontSize: 30, color: '#2a2aaf' }} />
      </div>
      <div className="qr_courses">
        <label>Pick a course:</label>
        <select name="data" onChange={(e) => handleChange(e)}>
          {courses && courses.map((course) => (
            <option key={course.course_code} value={`${course.course_name} - ${course.course_code}`}>
              {course.course_name} - {course.course_code}
            </option>
          ))}
        </select>
      </div>
      {isCodeGenerated &&
        <QRCode className='qrCode' value={qrCode} />
      }
      <button
        onClick={handleQRCode}
        className={`qrButton ${isCodeGenerated ? 'after' : 'before'}`}
      >
        Generate
      </button>
    </div>
  );
}

export default QrCode;
