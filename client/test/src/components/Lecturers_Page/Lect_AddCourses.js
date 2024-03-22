import React, { useState, useEffect, useRef, useCallback } from "react";
import { FaArrowLeft, FaBars, FaBell, FaCopyright } from 'react-icons/fa';
import logo from "../Pictures/logo.jpg";
import Axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const LectAddCourses = () => {
  const location = useLocation();
  const { lect_username, lect_id } = location.state;
  const navigate = useNavigate();
  const [isOpen, setOpen] = useState(false);
  const sidebarRef = useRef(null);
  const [state, setState] = useState({
    session: "",
    department: "",
    course_name: "",
    course_code: ""
  });
  const [sessionError, setSessionError] = useState("");
  const [departmentError, setDepartmentError] = useState("");
  const [courseNameError, setCourseNameError] = useState("");
  const [courseCodeError, setCourseCodeError] = useState("");
  const [formValid, setFormValid] = useState(false);

  const handleChange = useCallback((e) => {
    const { id, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [id]: value
    }));
  }, []);

  const validateForm = useCallback(() => {
    const sessionValid = state.session.trim() !== "";
    const departmentValid = state.department.trim() !== "";
    const courseNameValid = state.course_name.trim() !== "";
    const courseCodeValid = state.course_code.trim() !== "";

    setSessionError(sessionValid ? "" : "Session is required");
    setDepartmentError(departmentValid ? "" : "Department is required");
    setCourseNameError(courseNameValid ? "" : "Course Name is required");
    setCourseCodeError(courseCodeValid ? "" : "Course Code is required");

    return sessionValid && departmentValid && courseNameValid && courseCodeValid;
  }, [state]);

  useEffect(() => {
    setFormValid(validateForm());
  }, [validateForm]);

  const handleSubmit = useCallback((e) => {
    console.log(state);
    e.preventDefault();
    if (!validateForm()) {
      return; // Do not proceed if form is invalid
    }
    Axios.post(`http://${window.location.hostname}:5000/courses`, {
      session: state.session,
      course_name: state.course_name,
      course_code: state.course_code,
      department: state.department,
      lect_id: lect_id
    }).then((result) => {
      console.log(result);
      if (result.status === 200) {
        window.alert("Successfully registered a course");
        window.location.reload(); // Reloads page after courses have been sent
      }
    }).catch((err) => {
      console.log(err);
      if (err.response.data === "Course already exists for the specified matric_num or lect_id"){
        alert("You have already registered this course");
      }else if(err.message === "Network Error"){
        alert("Server's Offline");
      }else if(err.message === "Request failed with status code 500"){
        alert("Internal Server Error");
      }else if(err.message === "Request failed with status code 409"){
        alert(`${state.course_name} already exists`);
      }
    });
  }, [lect_id, state, validateForm]);

  const handleToggle = useCallback(() => {
    setOpen(!isOpen);
  }, [isOpen]);

  const handleOutsideClick = useCallback((event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [handleOutsideClick]);

  return (
    <div>
      <nav className="Header">
        <FaBars className="icons" onClick={handleToggle} />
        <img className="as_logo" src={logo} alt="logo" />
        <h2 className="page_name">Add Courses</h2>
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
          <li><button style={{ marginRight: '29.5%' }} className="sidebar-links" onClick={() => { navigate('/qrCode', { state: { lect_username, lect_id } }) }}>QRCode Generator</button></li>
          <li><a style={{ marginLeft: '32.5%' }} className="sidebar_content" href="/lectSignIn">Log Out</a></li>
        </ul>
        <FaCopyright style={{ position: "absolute", bottom: 5, left: 5, fontSize: 30, color: '#2a2aaf' }} />
      </div>

      <div style={{marginBottom:'2%', marginTop:'2.5%'}} className="course_container">
        <label style={{fontSize:'23px'}} className="course_container_header" htmlFor="session">Session</label>
        <div className="course_container_content">
          <input style={{marginBottom:"5%", marginTop:'-1%'}} type="text" id="session" placeholder="e.g. 2024/2025" onChange={handleChange} />
          <label className="errors">{sessionError}</label>
        </div>
      </div>
      <div style={{marginBottom:'2%', marginTop:'2.5%'}} className="course_container">
        <label style={{fontSize:'23px', marginLeft:'2%'}} htmlFor="department">Department</label>
        <div className="course_container_content">
          <input type="text" id="department" className="input-field" style={{ marginBottom: "5%", marginTop: '-1%' }} onChange={handleChange} />
          <label className="errors">{departmentError}</label>
        </div>
      </div>
      <div style={{marginBottom:'2%', marginTop:'2.5%'}} className="course_container">
        <label style={{fontSize:'23px', marginLeft:'2%'}} htmlFor="course_name">Course Name</label>
        <div className="course_container_content">
          <input type="text" id="course_name" className="input-field" style={{ marginBottom: "5%", marginTop: '-1%' }} onChange={handleChange} />
          <label className="errors">{courseNameError}</label>
        </div>
      </div>
      <div style={{marginBottom:'2%', marginTop:'2.5%'}} className="course_container">
        <label style={{fontSize:'23px', marginLeft:'2%'}} htmlFor="course_code">Course Code</label>
        <div className="course_container_content">
          <input type="text" id="course_code" className="input-field" style={{ marginBottom: "5%", marginTop: '-1%' }} onChange={handleChange} />
          <label className="errors">{courseCodeError}</label>
        </div>
      </div>
      <button type="submit" style={{padding:'1%', width:'11.5%', marginLeft:'43%'}} className="submit" disabled={!formValid} onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default LectAddCourses;
