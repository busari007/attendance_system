import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Axios from 'axios';

function PasswordChanged() {
  const location = useLocation();
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [formValid, setFormValid] = useState(false);
  const navigate = useNavigate();
  const { data } = location.state;

  const handlePasswordChange = (e) => {
    const newValue = e.target.value;
    setPassword(newValue);
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
    console.log(data);
    setFormValid(validatePassword(password));
  }, [password,data]);

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    Axios.post(`https://${window.location.hostname}:5000/changedPassword`,{
      data:data,
      password:password
    }).then((res)=>{
       alert("Password Successfully Changed!");
       navigate('/');
    }).catch((err)=>{
      if (err.message === "Request failed with status code 401") {
        window.alert("Invalid Details");
      }else if(err.message === "Network Error") {
        window.alert("The Server is offline");
      }else if(err.message === "Request failed with status code 500") {
        window.alert("Internal Server Error");
      } });
  };

  return (
    <div>
      <div className='container' style={{ marginTop: "7%" }}>
        <h1 className='header' style={{ marginTop: "15vh" }}>Change Password</h1>
        <form className='form' style={{ marginLeft: "-5%" }} onSubmit={(e) => handleSubmit(e)}>
          <label>Enter your new password</label>
          <label className="errors">{passwordError}</label>
          <input id="currentPassword" type="password" onChange={handlePasswordChange} value={password} />
          {formValid ? "": (<label className="submitting_confirmation">Ensure all fields are filled</label>)}
          <input type='submit' className='submit' disabled={!formValid} style={{ width: "40%", marginLeft: "33.5%" }} />
        </form>
      </div>
    </div>
  );
}

export default PasswordChanged;
