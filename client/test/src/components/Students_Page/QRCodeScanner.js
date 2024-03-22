import React, { useState, useEffect, useRef } from 'react';
import { FaArrowLeft, FaBars, FaBell, FaCopyright } from 'react-icons/fa';
import QrReader from 'react-web-qr-reader';
import logo from '../Pictures/logo.jpg';
import { useLocation, useNavigate } from 'react-router-dom';
import Axios from 'axios';

function QRCodeScanner(props) {
    const location = useLocation();
    const { username, matric_num } = location.state;
    const navigate = useNavigate();
    const delay = 2000;
    const previewStyle = {
        height: 320,
        width: 320,
    };
    const [course_id, setCourseId] = useState("");
    const [display, setDisplay] = useState(false);
    const [result, setResult] = useState([]);
    const [isOpen, setOpen] = useState(false);
    const sidebarRef = useRef(null);
    const [isCodeGenerated, setIsCodeGenerated] = useState(false);
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [lect_latitude, setLectLatitude] = useState(null);
    const [lect_longitude, setLectLongitude] = useState(null);
    const [isWithinBoundary, setIsWithinBoundary] = useState();
    const classroomWidth = 20; // Specify the width of the classroom boundary in meters
    const [distance, setDisance] = useState();
    const [loading, setLoading] = useState(true);

    const handleDisplay = () => {
        setDisplay(!display);
        setIsCodeGenerated(!isCodeGenerated);
    }

    const handleScan = (dataString) => {
        try {
            const data = JSON.parse(dataString.data);
            const lect_id = data.lect_id;
            const course_code = data.course_code;
            if (dataString) {
                setResult(data);
    
                Axios.post(`http://${window.location.hostname}:5000/getCourseId`, {
                    course_code: course_code,
                    matric_num: matric_num
                }).then((res) => {
                    const { course_id } = res.data[0];
                    Axios.post(`http://${window.location.hostname}:5000/getLocation`,{
                        lect_id: lect_id,
                    }).then((res) => {
                        const { latitude, longitude } = res.data[0];
                        setLectLatitude(latitude);
                        setLectLongitude(longitude);
    
                        // Verify video element and properties before use
                        const videoElement = document.querySelector('video'); // Selects the first <video> element in the document
                        if (videoElement && videoElement.videoWidth !== null) {
                            // Check if distance is within the boundary
                           if (distance <= classroomWidth) {
                                setIsWithinBoundary(true);
                                if (course_id !== "") {
                                    Axios.post(`http://${window.location.hostname}:5000/attendance`, {
                                        matric_num: matric_num,
                                        course_id: course_id,
                                        Status: 1
                                    }).then((res) => {
                                        window.alert('Attendance successfully recorded');
                                        console.log(res);
                                        navigate('/home', { state: { username, matric_num } });
                                    }).catch((err) => {
                                        console.log(err);
                                    if(err.message === "Request failed with status code 500"){
                                        alert("Internal Server Error");
                                    }else if(err.message === "Network Error"){
                                      alert("Server's Offline");
                                  }
                                    });
                                    alert("you are within boundary");
                                } else {
                                    alert("course_id not sent");
                                }
                            } else {
                                setIsWithinBoundary(false);
                                alert("You are not within the class' boundary");
                                alert("Your attendance will not be recorded");
                            }
                        } else {
                            console.error("Video element or properties not available.");
                        }
                    }).catch((err) => {
                        console.log(err);
                        if(err.message === "Request failed with status code 500"){
                            alert("Internal Server Error");
                        }else if(err.message === "Network Error"){
                          alert("Server's Offline");
                      }
                    });
                }).catch((err) => {
                    console.log(err);  
                    if(err.message === "Request failed with status code 500"){
                        alert("Internal Server Error");
                    }else if(err.message === "Network Error"){
                      alert("Server's Offline");
                  }
                });
            }
        } catch (error) {
            console.error("Error occurred:", error);
            // Handle the error here, such as displaying a user-friendly message or logging it
        }
    };
    
    const handleError = (error) => {
        alert(error);
    };

    const handleToggle = () => {
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

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function (position) {
                const { latitude, longitude } = position.coords;
                setLatitude(latitude);
                setLongitude(longitude);
                setLoading(false);
                console.log("The user's latitude and longitude are "+ latitude + " " + longitude);
                // Function to calculate distance between two points using Haversine formula
                const calculateDistance = (lat1, lon1, lat2, lon2) => {
                    const R = 6371; // Radius of the Earth in kilometers
                    const dLat = (lat2 - lat1) * (Math.PI / 180); // Convert degrees to radians
                    const dLon = (lon2 - lon1) * (Math.PI / 180); // Convert degrees to radians
                    const a =
                        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);
                    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                    const distanceKm = R * c; // Distance in kilometers
                    const distanceMeters = distanceKm * 1000; // Convert distance to meters
                    return distanceMeters; // Distance in meters
                };
                
                // Coordinates for Point 1
                const lat1 = lect_latitude;
                const lon1 = lect_longitude;
                
                // Coordinates for Point 2
                const lat2 = latitude;
                const lon2 = longitude;
                
                console.log("The lecturer's latitude and longitude are "+ lect_latitude + " " + lect_longitude);
                
                if(lat1 !== null && lon1 !== null){
                // Calculate distance both ways and compare
                const distanceFromPoint1To2 = calculateDistance(lat1, lon1, lat2, lon2);
                setDisance(distanceFromPoint1To2);
                console.log(distance);  
                }else{
                  console.log("They null");
                }
            });
        } else { 
            setLatitude(6.894331);
            setLongitude(3.722595);
            setLoading(false);
            console.log("Location not identified. New Horizon has been set as the default");
        }
    }, [lect_latitude,lect_longitude,distance]);

    if (loading) {
      return <div><p style={{marginTop:"19%",fontSize:"40px",fontWeight:'bolder', textAlign:"center"}}>Loading... {("ensure location services are turned on")}</p></div>;
    }
    
    return (
        <div>
            <nav className="Header">
                <FaBars className="icons" onClick={handleToggle} />
                <img className="as_logo" src={logo} alt="logo" />
                <h2 className="page_name">Scanner</h2>
                <p className="welcome_text">Welcome, {username || "Guest"}</p>
                <FaBell className="icons" />
            </nav>
            <div className={`sidebar ${isOpen ? 'open' : 'close'}`} ref={sidebarRef}>
                <div id="sidebarHeader">
                    <FaArrowLeft style={{ color: 'rgb(65,65,65)' }} onClick={handleToggle} className="icons" />
                    <h2>UAS</h2>
                </div>
                <ul>
                    <li><button style={{ marginLeft: '35.5%' }} className="sidebar-links" onClick={() => { navigate('/home', { state: { username, matric_num } }) }}>Home</button></li>
                    <li><button style={{ marginRight: '29.5%' }} className="sidebar-links" onClick={() => { navigate('/courses', { state: { username, matric_num } }) }}>Course List</button></li>
                    <li><button className="sidebar-links" onClick={() => { navigate('/addCourses', { state: { username, matric_num } }) }}>Add Courses</button></li>
                    <li><a style={{ marginLeft: '32.5%' }} className="sidebar_content" href="/signIn">Log Out</a></li>
                </ul>
                <FaCopyright style={{ position: "absolute", bottom: 5, left: 5, fontSize: 30, color: '#2a2aaf' }} />
            </div>

            <div>
                {display && <QrReader
                    className='qrReader'
                    delay={delay}
                    style={previewStyle}
                    onError={handleError}
                    onScan={(data) => handleScan(data)}
                />}
                <button
                    onClick={handleDisplay}
                    className={`qrButton ${isCodeGenerated ? 'after' : 'before'}`}
                >
                    {isCodeGenerated ? 'X' : 'Display'}
                </button>
            </div>
        </div>
    );
}

export default QRCodeScanner;
