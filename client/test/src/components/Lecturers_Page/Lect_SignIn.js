import React, { useState, useEffect } from "react";
import logo from "../Pictures/babcock-logo.gif";
import Axios from 'axios';
import { useNavigate } from "react-router-dom";
import { FaCheck } from 'react-icons/fa';

function LectSignIn(props) {
    const navigate = useNavigate();
  const [state, setState] = useState(props.state);
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [formValid, setFormValid] = useState(false);

  const handleUsernameChange = (e) => {
    const newValue = e.target.value;
    setState((prevState) => ({ ...prevState, lect_username: newValue }));
  };

  const handlePasswordChange = (e) => {
    const newValue = e.target.value;
    setState((prevState) => ({ ...prevState, lect_password: newValue }));
  };

  const validateUsername = (value) => {
    if (value.length === 0) {
      setUsernameError("Enter your username");
      return false;
    }else if(value.length <= 4){
        setUsernameError("Username too short");
        return false;
      }else if(value.length >= 12){
        setUsernameError("Username too long");
        return false;
      }else{
        setUsernameError("");
        return true;
      }
  };

  const validatePassword = (value) => {
    if (value.length === 0) {
      setPasswordError("Enter your password");
      return false;
    }
    const isValid = value.length >= 6;
    setPasswordError(isValid ? "" : "Password should be at least 6 characters");
    return isValid;
  };

  useEffect(() => {
    setFormValid(validateUsername(state.lect_username) && validatePassword(state.lect_password));
  }, [state.lect_username, state.lect_password]);

  const handleSubmit = (e) => {
    console.log(window.location.hostname);
    e.preventDefault();
    Axios.post(`https://${window.location.hostname}:5000/lectLogIn`, { //http://localhost:5000
      lect_username: state.lect_username,
      lect_password: state.lect_password
    }).then((response) => {
      console.log("Server response: ", response);
      if (response.status === 200) {
        const { lect_username, lect_id ,success } = response.data;
        console.log("Successfully Validated");
        console.log(lect_username);
        setState((prevState) => ({ ...prevState, lect_username: lect_username, lect_id: lect_id ,result: success, homesRender: true }));
        console.log("username in sign in: ", state.username);
        navigate('/lectHome', {state:{ lect_username, lect_id }} );
      } else {
        console.log(response.status);
      }
    }).catch((err) => {
      console.error(err);
      if (err.message === "Request failed with status code 401") {
        window.alert("Invalid Details");
      }else if(err.message === "Network Error"){
        window.alert("Server's Offline");
      }
    });
  };

  return (
    <div>
      <div className="container">
        <img id="background_logo" src={logo} alt="background logo" />
        <form className="form" onSubmit={(e) => handleSubmit(e)}>
          <h1 className="header">Sign In</h1>
          <label htmlFor="Matric_num">Username</label>
          <label className="errors">{usernameError}</label>
          <input type="text" id="username" onChange={handleUsernameChange} />
          <label htmlFor="password">Password</label>
          <label className="errors">{passwordError}</label>
          <input type="password" id="password" onChange={handlePasswordChange} />
          {formValid ? "": (<label className="submitting_confirmation">Ensure all fields are filled</label>)}
          <button className="submit" disabled={!formValid}>{"Log In"}</button>
          <p id="signIn_link">Don't have an account? Sign up <a className="links" href="/lectSignUp">here</a></p>
        </form>   
        <a className="links" href="/changePassword" style={{position:"absolute",bottom:10,right:10,textDecoration:"none"}}>Change Password</a>
      </div>
      <p style={{position:'absolute', bottom:0, right:0}}>A <a style={{textDecoration:'none'}} className="links" href="/signIn">Student?</a></p>
     </div>
  );
}

export default LectSignIn;
