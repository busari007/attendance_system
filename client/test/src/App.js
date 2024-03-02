import "./App.css";
import SignUp from "./components//signUpPage";
import SignIn from "./components/signInPage";
import Home from "./components/Students_Page/Home";
import AddCourses from "./components/Students_Page/addCourses";
import Courses from "./components/Students_Page/Courses";
import QrCode from "./components/Lecturers_Page/QrCode";
import LectSignIn from "./components/Lecturers_Page/Lect_SignIn";
import LectSignUp from "./components/Lecturers_Page/Lect_SignUp";
import LectHome from "./components/Lecturers_Page/Lect_Home";
import LectAddCourses from "./components/Lecturers_Page/Lect_AddCourses";
import LectCourses from "./components/Lecturers_Page/Lect_Courses";
import QRCodeScanner from "./components/Students_Page/QRCodeScanner";
import { BrowserRouter,Routes, Route} from "react-router-dom";
import Location from "./locationTest";
import React from "react";

class App extends React.Component{

  constructor(){
    super();
  this.state={
      lect_id:"",
      username:"",
      lect_username:"",
      matric_num:"",
      password:"",
      lect_password:"",
      matricNum_valid:false,
      password_valid:false,
      homesRender:false,
      result:false,
      form_valid:false,
      email:"",
        usernameValid:false,
        emailValid:false,
      Errors:{
          C_username:"",
          C_email:"",
          C_password:"",
          C_matricNum:""
      },
    submitError:false
  }
}
 render(){
  return(
    <div>
       <BrowserRouter>
        <Routes>
            <Route path="/" element={<SignIn state={this.state}/>}/>
            <Route path="/location" element={<Location/>}/>
            <Route path="/signUp" element={<SignUp state={this.state}/>}/>  
            <Route path="/home" element={<Home />}/>
            <Route path="/addCourses" element={<AddCourses/>}/>
            <Route path="/courses" element={<Courses />}/>
            <Route path="/qrCode" element={<QrCode />}/>
            <Route path="/lectSignUp" element={<LectSignUp state={this.state}/>}/>
            <Route path="/lectSignIn" element={<LectSignIn state={this.state}/>}/>
            <Route path="/lectHome" element={<LectHome />}/>
            <Route path="/lectAddCourses" element={<LectAddCourses />}/>
            <Route path="/lectCourses" element={<LectCourses />}/>
            <Route path="/qrCodeScanner" element={<QRCodeScanner />}/>
       </Routes>    
       </BrowserRouter>
    </div>
  );
}
}
export default App;