import "../Styles/signUpPage.css";
import logo from "../Pictures/babcock-logo.gif";
import React from "react";
import Axios from 'axios';
import { Navigate } from "react-router-dom";

class SignUp extends React.Component{
  constructor(props){
    super(props);
    this.state = this.props.state;
  }
  handleChange(e){
      const name = e.target.id;
      const value = e.target.value;
      this.setState({[name]:value},()=>{this.validateForm(name,value)});
      console.log(this.state);
  }
  validateForm = (name,value) =>{
    let usernameValid = this.state.usernameValid;
    let emailValid = this.state.emailValid;
    let passwordValid = this.state.passwordValid;
    let matricNumValid = this.state.matricNumValid;
    let Errors = this.state.Errors;

    switch(name){
      case 'username': 
      usernameValid = value.length >= 5;
      Errors.C_username = usernameValid ? '' : "Username too short";
      if(this.state.username === ""){
        usernameValid = false;
        Errors.C_username = usernameValid ? '' : "Please enter your username";
    }
      break;

      case 'email':
          emailValid =  value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
          Errors.C_email = emailValid ? '' : "Improper format";
          if(this.state.email === ""){
              emailValid = false;
              Errors.C_email = emailValid ? '' : "Please enter an email";
          }
       break;

      case 'password':
          passwordValid = value.length >= 6;
          Errors.C_password = passwordValid ? '' : "password is too short";
          if(this.state.password === ""){
            passwordValid = false;
            Errors.C_password = passwordValid ? '' : "Please enter a password";
        }
          break;
      
      case 'matric_num':
        matricNumValid = value.match(/^\d{2}\/\d{4}$/) || value.match(/^\d{6}$/);  
        Errors.C_matricNum = matricNumValid ? '' : "Improper format";
        if(this.state.matric_num === ""){
          matricNumValid = false;
          Errors.C_matricNum = matricNumValid ? '' : "Please enter your Matric Number/Application ID";
      }
        break;
      default:
      break;
    }
    this.setState({
      usernameValid:usernameValid,
      emailValid:emailValid,
      passwordValid:passwordValid,
      matricNumValid:matricNumValid,
      Errors:Errors
    }, this.confirmValidation);
  }
  confirmValidation= () => {
    console.log(this.state.formValid);
      this.setState({
        formValid: this.state.usernameValid&&this.state.emailValid&&this.state.passwordValid&&this.state.matricNumValid,
       // submitError:this.state.formValid
      })
  }

  handleSubmit=(e)=>{
    e.preventDefault();
   Axios.post('http://localhost:5000/register',{
    username:this.state.username,
    email:this.state.email,
    password:this.state.password,
    matric_num:this.state.matric_num,
   }).then((res)=>{
    const response = res.status;
    console.log("Successfully submitted",response);
    if(response === 200){
      this.setState({result:true});
    }
   }).catch((err)=>{
    console.log(err);
   });
  }
  render(){
  return(
    <div>
      <div className="container">
    <img  id="background_logo" src={logo} alt="background logo"/>
      <form className="form" method="POST" onSubmit={(e)=>this.handleSubmit(e)}>
        <h2 className="header">Sign Up</h2>
        <label htmlFor="username">Username</label>
        <label className="errors">{this.state.Errors.C_username}</label>
        <input type="text" id="username" onChange={(e)=>this.handleChange(e)}/>
        <label htmlFor="email">Email</label>
        <label className="errors">{this.state.Errors.C_email}</label>
        <input type="email"  id="email" onChange={(e)=>this.handleChange(e)}/>
        <label htmlFor="password">Password</label>
        <label className="errors">{this.state.Errors.C_password}</label>
        <input type="password" id="password" onChange={(e)=>this.handleChange(e)}/>
        <label htmlFor="matric_num">Matric Number/Applic ID</label>
        <label className="errors">{this.state.Errors.C_matricNum}</label>
        <input type="text" id="matric_num" onChange={(e)=>this.handleChange(e)}/>
       {this.state.formValid? (<label className="submitting_confirmed">Good to go!!!</label>) : (<label className="submitting_confirmation">Ensure all fields are filled</label>)}
        <button className="submit" disabled={!this.state.formValid}>Register {(this.state.result? true: false) && <Navigate to="/home"/>}</button>
        <p id="signIn_link">Already have an account? Sign in <a className="links" href="/">here</a></p>
      </form>
      </div>
    </div>
  );
  }
}
export default SignUp;