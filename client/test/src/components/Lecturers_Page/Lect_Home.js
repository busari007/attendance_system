import React, { useState, useEffect, useRef } from "react";
import { FaArrowLeft, FaBars, FaBell, FaCopy } from "react-icons/fa";
import { redirect, useLocation, useNavigate } from "react-router-dom";
import Axios from "axios";
import logo from "../Pictures/logo.jpg";
import "../Styles/Home.css";

function LectHome() {
  const location = useLocation();
  const [lect_id, setLectId] = useState();
  // Retrieve username and matric_num from local storage
  const storedUsername = localStorage.getItem('lect_username');
  const { lect_username = storedUsername || "Guest"} = location.state || {};
  const navigate = useNavigate();
  const [isOpen, setOpen] = useState(false);
  const sidebarRef = useRef(null);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function handleToggle() {
    setOpen(!isOpen);
  }

  const handleOutsideClick = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    localStorage.setItem('lect_username', lect_username);
    Axios.post(`https://${window.location.hostname}:5000/lectId`, {  //http://${window.location.hostname}:5000 for local server
      lect_username: lect_username,
    })
      .then(({ data: { lect_id, courseCodes } }) => {
        setLectId(lect_id);
        if(courseCodes[0] !== null){
        Axios.post(
          `https://${window.location.hostname}:5000/getStudentsAttendance`,
          {
            course_code: courseCodes,
          }
        )
          .then((res) => {
            setAttendance(res.data.records);
            console.log(attendance);
            setLoading(false);
          })
          .catch((err) => {
            console.log("Error fetching records:", err);
            if(err.message === "Request failed with status code 500"){
              alert("Internal Server Error");
          }else if(err.message === "Network Error"){
            alert("Server's Offline");
        }else if(err.response.data.message === "No attendance records found for the specified course_code"){
          alert("No attendance data found");
          setLoading(false);
      }
          });}else{
            setLoading(false);
            alert("No attendance data found")
          } 
      })
      .catch((err) => {
        console.log(err);
        if(err.response.data.message === "Lect Id not found"){
          alert("The lecturer doesnt exist");
        }else if(err.message === "Request failed with status code 500"){
          alert("Internal Server Error");
      }else if(err.message === "Network Error"){
        alert("Server's Offline");
    }
      });
    document.addEventListener("mousedown", handleOutsideClick);
    
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [lect_username]);

  function handleDelete(attendanceID,course_id){
    console.log("Its attendanceID is ", attendanceID, " and its course_id is", course_id);
     Axios.post(`https://${window.location.hostname}:5000/deleteRecord`,{
        attendanceID: attendanceID,
        course_id: course_id
     }).then((result)=>{
        console.log(result);
        alert(`Record successfully deleted`);
        setAttendance(prevAttendance => prevAttendance.filter(attendance => attendance.attendanceID !== attendanceID));
     }).catch((error)=>{
        console.log(error);
        if(error.message === "Network error"){
            alert("The server's Offline");
        }else if(error.message === "Request failed with status code 500"){
          console.log("Internal Server Error");
        }else{
        alert("Error deleting course");
        }
     });
  }


  const handleEdit = (newValue, rowIndex, columnIndex,attendanceID, matric_num) => {
    const updatedAttendance = [...attendance];
    updatedAttendance[rowIndex][columnIndex] = newValue;
    setAttendance(updatedAttendance);
    console.log("The data cells attendanceID is " + attendanceID);
    Axios.post(`https://${window.location.hostname}:5000/updateAttendance`, {
      attendanceID: attendanceID,
      newStatus: newValue
    })
    .then(response => {
      console.log(`Status for ${matric_num} updated successfully`);
    })
    .catch(error => {
      console.error("Error updating status:", error);
      if(error.message === "Network error"){
        alert("The server's Offline");
    }else if(error.message === "Request failed with status code 500"){
      console.log("Internal Server Error");
    }else if(error.response.data === 'Invalid status input'){
      alert('Status can only be 0 or 1');
    }
    });
  };

  if (loading) {
    return <div><p style={{marginTop:"19%",fontSize:"40px",fontWeight:'bolder', textAlign:"center"}}>Loading...</p></div>;
  }

  return (
    <div>
      <nav className="Header">
        <FaBars className="icons" onClick={handleToggle} />
        <img className="as_logo" src={logo} alt="logo" />
        <h2 className="page_name">Home</h2>
        <p className="welcome_text">Welcome, {lect_username || "Guest"}</p>
        <FaBell className="icons" />
      </nav>
      <div className={`sidebar ${isOpen ? "open" : "close"}`} ref={sidebarRef}>
        <div id="sidebarHeader">
          <FaArrowLeft
            style={{ color: "rgb(65,65,65)" }}
            onClick={handleToggle}
            className="icons"
          />
          <h2>UAS</h2>
        </div>
        <ul>
          <li>
            <button
              style={{ marginLeft: "33.5%" }}
              className="sidebar-links"
              onClick={() => {
                navigate("/lectCourses", { state: { lect_username, lect_id } });
              }}
            >
              Courses
            </button>
          </li>
          <li>
            <button
              className="sidebar-links"
              onClick={() => {
                navigate("/lectAddCourses", {
                  state: { lect_username, lect_id },
                });
              }}
            >
              Add Course
            </button>
          </li>
          <li>
            <button
              style={{ marginRight: "29.5%" }}
              className="sidebar-links"
              onClick={() => {
                navigate("/qrCode", { state: { lect_username, lect_id } });
              }}
            >
              QRCode Generator
            </button>
          </li>
          <li>
            <a
              style={{ marginLeft: "33.5%" }}
              className="sidebar_content"
              href="/lectSignIn"
            >
              Log Out
            </a>
          </li>
        </ul>
        <FaCopy
          style={{ position: "absolute", bottom: 5, left: 5, fontSize: 30, color: "#2a2aaf" }}
        />
      </div>
      <div className="records_container">
      {Array.from(new Set(attendance.map((data) => data.course_code))).map((courseCode) => {
  const courseData = attendance.filter((data) => data.course_code === courseCode);

  return (
    <div className="attendanceTableContainer">
      <table
        className={`attendanceTable ${attendance.length > 4 ? "scrollable" : ""}`}
        key={courseCode}
      >
        <caption>{courseData[0].course_name} - {courseCode}</caption>
        <thead>
          <tr>
            <th>Students' Matric Numbers</th>
            <th>Attendance date</th>
            <th>Attendance time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {courseData.map((entry, entryIndex) => (
            <tr key={entryIndex}>
              <td>{entry.matric_num}</td>
              <td>{entry.dateTaken}</td>
              <td>{entry.timeTaken}</td>
              <td
                className="status"
                contentEditable
                suppressContentEditableWarning
                onBlur={(event) => handleEdit(event.target.innerText, entryIndex, 3, entry.attendanceID, entry.matric_num)}
              >
                {entry.status}
              </td>
              <td> 
                <div className="delete" style={{ textAlign: "center", fontSize:"25px",padding:"10px" }} onClick={() => handleDelete(entry.attendanceID, entry.course_id)}>X</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
})}



        <p>{attendance.length === 0 && 'No attendance data yet'}</p>
      </div>
    </div>
  );
}

export default LectHome;
