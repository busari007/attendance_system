import React, { useState, useEffect } from "react";
import logo from "../Pictures/babcock-logo.gif";
import Axios from 'axios';
import { useNavigate } from "react-router-dom";

function SignIn(props) {
    const navigate = useNavigate();
  const [state, setState] = useState(props.state);
  const { username } = props.state;
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
    const isValid = value.match(/^\d{2}\/\d{4}$/);
    setMatricNumError(isValid ? "" : "Improper matriculation format");
    return isValid;
  };

  const validatePassword = (value) => {
    const isValid = value.length >= 6;
    setPasswordError(isValid ? "" : "Password should be at least 6 characters");
    return isValid;
  };

  useEffect(() => {
    setFormValid(validateMatricNum(state.matric_num) && validatePassword(state.password));
  }, [state.matric_num, state.password]);

  const handleSubmit = (e) => {
    e.preventDefault();
    Axios.post('http://localhost:5000/logIn', {
      matric_num: state.matric_num,
      password: state.password
    }).then((response) => {
      console.log("Server response: ", response);
      if (response.status === 200) {
        const { username, success } = response.data;
        console.log("Successfully Validated");
        console.log(username);
        setState((prevState) => ({ ...prevState, username: username, result: success, homesRender: true }));
        console.log("username in sign in: ", state.username);
        navigate('/home', {state:{ username }} );
      } else {
        console.log(response.status);
      }
    }).catch((err) => {
      console.error(err.message);
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
          {formValid ? (<label className="submitting_confirmed">Good to go!!!</label>) : (<label className="submitting_confirmation">Ensure all fields are filled</label>)}
          <button className="submit" disabled={!formValid}>{"Log In"}</button>
          <p id="signIn_link">Don't have an account? Sign up <a className="links" href="/signUp">here</a></p>
        </form>
      </div>
    </div>
  );
}

export default SignIn;
