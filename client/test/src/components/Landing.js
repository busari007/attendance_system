import React,{ useState } from "react";
import background_image from './Pictures/landing_page_background.jpg';

function Landing(){
  return(
    <div style={{display:'flex'}}>
        <img style={{width:'60%',height:'100vh', objectFit:'cover'}} src={ background_image } alt="landing_page_image"/>
        <div>
        <h1 style={{margin:'6%', marginTop:'35vh',textAlign:'center'}}>Welcome to Babcock University's Quick Response(QR) Code Attendance Management System</h1>
        <a style={{marginLeft:'14.8vw',fontSize:'29px'}} className="links" href="/signUp">Register Now</a>
        </div>
    </div>
  );
}
export default Landing;