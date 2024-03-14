import React, { useState, useEffect, useRef } from "react";
import { FaArrowLeft, FaBars, FaBell, FaCopy } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import Axios from "axios";
import logo from "../Pictures/logo.jpg";
import "../Styles/Home.css";

function LectHome() {
  const location = useLocation();
  const [lect_id, setLectId] = useState();
  const { lect_username } = location.state;
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
    Axios.post(`http://${window.location.hostname}:5000/lectId`, {  //http://${window.location.hostname}:5000 for local server
      lect_username: lect_username,
    })
      .then(({ data: { lect_id, courseCodes } }) => {
        setLectId(lect_id);
        console.log(courseCodes);
        if(courseCodes[0] !== null){
        Axios.post(
          `http://${window.location.hostname}:5000/getStudentsAttendance`,
          {
            course_code: courseCodes,
          }
        )
          .then((res) => {
            setAttendance(res.data.records);
            setLoading(false);
          })
          .catch((err) => {
            console.error("Error fetching records:", error);
          });}else{
            setLoading(false);
            alert("No attendance data found")
          }
      })
      .catch((err) => {
        console.log(err);
        if(err.response.data.message === "Lect Id not found"){
          alert("The lecturer doesnt exist");
        }
      });
    document.addEventListener("mousedown", handleOutsideClick);
    
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [lect_username]);



  const handleEdit = (newValue, rowIndex, columnIndex,attendanceID) => {
    const updatedAttendance = [...attendance];
    updatedAttendance[rowIndex][columnIndex] = newValue;
    setAttendance(updatedAttendance);
    console.log("The data cells attendanceID is " + attendanceID);
    Axios.post(`http://${window.location.hostname}:5000/updateAttendance`, {
      attendanceID: attendanceID,
      newStatus: newValue
    })
    .then(response => {
      console.log("Status updated successfully");
    })
    .catch(error => {
      console.error("Error updating status:", error);
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
                      onBlur={(event) => handleEdit(event.target.innerText, entryIndex, 3,entry.attendanceID)}
                    >
                      {entry.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          );
        })}
        <p>{attendance.length === 0 && 'No attendance data yet'}</p>
      </div>
    </div>
  );
}

export default LectHome;
