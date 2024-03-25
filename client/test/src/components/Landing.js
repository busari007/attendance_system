import React,{ useState } from "react";
import background_image from './Pictures/landing_page_background.jpg';

function Landing(){
  return(
    <div className="landingPage" style={{display:'flex'}}>
        <img id="landingPageImage" src={ background_image } alt="landing_page_image"/>
        <div style={{border:'1px solid black'}}>
        <h1 className="landingPageText">Welcome to Babcock University's Quick Response(QR) Code Attendance Management System</h1>
        <a id="landingPageLink" className="links" href="/signUp">Register Now</a>
        </div>
    </div>
  );
}
export default Landing;