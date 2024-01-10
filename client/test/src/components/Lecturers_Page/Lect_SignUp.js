import "../Styles/signUpPage.css";
import logo from "../Pictures/babcock-logo.gif";
import React, { useEffect, useState } from "react";
import Axios from 'axios';
import { useNavigate } from "react-router-dom";

function LectSignUp(props) {
  const navigate = useNavigate();
  const [state, setState] = useState(props.state);
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [formValid, setFormValid] = useState(false);

  function handleInputChange(e, field) {
    const value = e.target.value;
    setState((prevState) => ({
      ...prevState,
      [field]: value
    }));
  }

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
    }

  const validateEmail = (value) => {
    if (value === undefined) {
      setEmailError("Email is required");
      return false;
    }
  
    const isValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
    setEmailError(isValid ? "" : "Input a proper email");
    return isValid;
  };

  const validatePassword = (value) => {
    if (value.length === 0) {
      setPasswordError("Enter your password");
      return false;
    }

    const isValid = value.length > 5;
    setPasswordError(isValid ? "" : "Password too short");
    return isValid;
  };

  useEffect(() => {
    setFormValid(
      validateUsername(state.lect_username) &&
      validateEmail(state.lect_email) &&           
      validatePassword(state.lect_password)
    );
  }, [state.lect_username,state.lect_email,state.lect_password]);
  

  function handleSubmit(e) {
    console.log(state);
    e.preventDefault();
    Axios.post('http://localhost:5000/lectRegister', {
      lect_email: state.lect_email,
      lect_password: state.lect_password,
      lect_username: state.lect_username,
      role: 'lecturer'
    }).then((res) => {
      const { lect_username  } = state;
      const response = res.status;
      console.log("Successfully submitted", response);
      if (response === 200) {
        setState({ result: true });
        navigate('/lectHome', { state: { lect_username }});  //navigates to Home.js and passes the username and matric number
        window.alert("Account successfully created");
      }
    }).catch((err) => {
      console.log(err);
      window.alert("Error creating account");
    });
  }

  return (
    <div>
      <div className="container">
        <img id="background_logo" src={logo} alt="background logo" />
        <form className="form" method="POST" onSubmit={(e) => handleSubmit(e)}>
          <h2 className="header">Sign Up</h2>
          <label htmlFor="username">Username</label>
          <label className="errors">{usernameError}</label>
          <input type="text" id="username" onChange={(e) => handleInputChange(e, 'lect_username')} />
          <label htmlFor="email">Email</label>
          <label className="errors">{emailError}</label>
          <input type="email" id="email" onChange={(e) => handleInputChange(e, 'lect_email')} />
          <label htmlFor="password">Password</label>
          <label className="errors">{passwordError}</label>
          <input type="password" id="password" onChange={(e) => handleInputChange(e, 'lect_password')} />
          {formValid ? (<label className="submitting_confirmed">Good to go!!!</label>) : (<label className="submitting_confirmation">Ensure all fields are filled</label>)}
          <button className="submit" disabled={!formValid}>Register</button>
          <p id="signIn_link">Already have an account? Sign in <a className="links" href="/lectSignIn">here</a></p>
        </form>
        <p style={{position:'absolute', bottom:0, right:0}}>A <a style={{textDecoration:'none'}} className="links" href="/signUp">Student?</a></p>
      </div>
    </div>
  );
}

export default LectSignUp;
