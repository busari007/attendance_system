import "./Styles/signUpPage.css";
import logo from "./Pictures/babcock-logo.gif";
import React, { useEffect, useState } from "react";
import Axios from 'axios';
import { useNavigate } from "react-router-dom";
import { FaCheck } from 'react-icons/fa';

function SignUp(props) {
  const navigate = useNavigate();
  const [state, setState] = useState(props.state);
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [matricNumError, setMatricNumError] = useState("");
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
      }else if(value.length > 11){
        setUsernameError("Username too long");
        return false;
      }else{
        setUsernameError("");
        return true;
      }
  };

  const validateEmail = (value) => {
    if (value.length === 0) {
      setEmailError("Enter your email");
      return false;
    }
    const isValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i); //regex that translates to the email format
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

  const validateMatricNum = (value) => {
    if (value.length === 0) {
      setMatricNumError("Enter your Matriculation Number/ Application Id");
      return false;
    }

    const isValid = value.match(/^\d{2}\/\d{4}$/) || value.match(/^\d{6}$/);
    setMatricNumError(isValid ? "" : "Input a proper matriculation number");
    return isValid;
  };

  useEffect(() => {
    setFormValid(
      validateUsername(state.username) &&
      validateEmail(state.email) &&           
      validatePassword(state.password) &&
      validateMatricNum(state.matric_num)
    );
  }, [state.username,state.email,state.password,state.matric_num]);
  

  function handleSubmit(e) {
    e.preventDefault();
    Axios.post(`http://${window.location.hostname}:5000/register`, {
      username: state.username,
      email: state.email,
      password: state.password,
      matric_num: state.matric_num,
      role: 'student'
    }).then((res) => {
      const { username, matric_num } = state;
      const response = res.status;
      console.log("Successfully submitted", response);
      if (response === 200) {
        setState({ result: true });
        navigate('/home', { state: { username, matric_num }});  //navigates to Home.js and passes the username and matric number
        window.alert("Account successfully created");
      }
    }).catch((err) => {
      console.log(err.response.data);
      if(err.message === "Network Error"){
        window.alert("Server's Offline");
      }else if(err.response.data === "Error inserting data into database"){
        window.alert("The Matric number/Application id already has an entry");
      }else if(err.response.data === "Username and matriculation number combination already exists. Please choose different credentials."){
        alert("Credential/s already exist. Use different ones");
      }else if(err.message === "Request failed with status code 500"){
        window.alert("Server's Offline");
      }
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
          <input type="text" id="username" onChange={(e) => handleInputChange(e, 'username')} />
          <label htmlFor="email">Email</label>
          <label className="errors">{emailError}</label>
          <input type="email" id="email" onChange={(e) => handleInputChange(e, 'email')} />
          <label htmlFor="password">Password</label>
          <label className="errors">{passwordError}</label>
          <input type="password" id="password" onChange={(e) => handleInputChange(e, 'password')} />
          <label htmlFor="matric_num">Matric Number/Applic ID</label>
          <label className="errors">{matricNumError}</label>
          <input type="text" id="matric_num" onChange={(e) => handleInputChange(e, 'matric_num')} />
          {formValid ? "": (<label className="submitting_confirmation">Ensure all fields are filled</label>)}
          <button className="submit" disabled={!formValid}>Register</button>
          <p id="signIn_link">Already have an account? Sign in <a className="links" href="/">here</a></p>
        </form>
      </div>
      <p style={{position:'absolute', bottom:0, right:0}}>A <a style={{textDecoration:'none'}} className="links" href="/lectSignUp">lecturer?</a></p>
      </div>
  );
}

export default SignUp;
