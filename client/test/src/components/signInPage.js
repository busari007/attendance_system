import React, { useState, useEffect } from "react";
import logo from "./Pictures/babcock-logo.gif";
import Axios from 'axios';
import { useNavigate } from "react-router-dom";
import { FaCheck } from 'react-icons/fa';

function SignIn(props) {
    const navigate = useNavigate();
  const [state, setState] = useState(props.state);
  const [matricNumError, setMatricNumError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [formValid, setFormValid] = useState(false);

  const handleMatricNumChange = (e) => {
    const newValue = e.target.value;
    setState((prevState) => ({ ...prevState, matric_num: newValue }));
  };

  const handlePasswordChange = (e) => {
    const newValue = e.target.value;
    setState((prevState) => ({ ...prevState, password: newValue }));
  };

  const validateMatricNum = (value) => {
    if (value.length === 0) {
      setMatricNumError("Enter your Matriculation Number/ Application Id");
      return false;
    }
    const isValid = value.match(/^\d{2}\/\d{4}$/) || value.match(/^\d{6}$/);
    setMatricNumError(isValid ? "" : "Improper matriculation format");
    return isValid;
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
    setFormValid(validateMatricNum(state.matric_num) && validatePassword(state.password));
  }, [state.matric_num, state.password]);


  const handleSubmit = (e) => {
    e.preventDefault();
    Axios.post(`http://localhost:5000/logIn`, { //https://vercel-backend-test-azure.vercel.app/ for hosted website  /${window.location.hostname}:5000 for local one
      matric_num: state.matric_num,
      password: state.password
    }).then((response) => {
      console.log("Server response: ", response);
      if (response.status === 200) {
        const { username, matric_num ,success } = response.data;
        console.log("Successfully Validated");
        setState((prevState) => ({ ...prevState, username: username, matric_num: matric_num ,result: success, homesRender: true }));
        console.log("username in sign in: ", state.username);
        navigate('/home', {state:{ username, matric_num }} );
      } else {
        console.log(response.status);
      }
    }).catch((err) => {
      alert(err);
      if (err.message === "Request failed with status code 401") {
        window.alert("Invalid Details");
      }
    });
  };

  return (
    <div>
      <div className="container">
        <img id="background_logo" src={logo} alt="background logo" />
        <form className="form" onSubmit={(e) => handleSubmit(e)}>
          <h1 className="header">Sign In</h1>
          <label htmlFor="Matric_num">Matric Number/Application ID</label>
          <label className="errors">{matricNumError}</label>
          <input type="text" id="matric_num" onChange={handleMatricNumChange} />
          <label htmlFor="password">Password</label>
          <label className="errors">{passwordError}</label>
          <input type="password" id="password" onChange={handlePasswordChange} />
          {formValid ? (<label className="submitting_confirmed"><FaCheck className='form_validated'/></label>) : (<label className="submitting_confirmation">Ensure all fields are filled</label>)}
          <button className="submit" disabled={!formValid}>{"Log In"}</button>
          <p id="signIn_link">Don't have an account? Sign up <a className="links" href="/signUp">here</a></p>
        </form>
        <a className="links" href="/changePassword" style={{position:"absolute",bottom:10,right:10,textDecoration:"none"}}>Change Password</a>
     </div>
     <p style={{position:'absolute', bottom:0, right:0}}>A <a style={{textDecoration:'none'}} className="links" href="/lectSignIn">lecturer?</a></p>
    </div>
  );
}

export default SignIn;
