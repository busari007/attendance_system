import React from "react";
import logo from "../Pictures/babcock-logo.gif";
import Axios from 'axios';
import Home from "./Home";
import { Navigate } from "react-router-dom";


class SignIn extends React.Component{

constructor(props){
    super(props);
  this.state= this.props.state;
}

handleChange=(e)=>{
    let name = e.target.id;
    let value = e.target.value;
    this.setState({[name]:value},()=>this.validateForm(name,value));
}
validateForm(name,value){
    let matricNum_valid = this.state.matricNum_valid;
    let password_valid = this.state.password_valid;
    let Errors = this.state.Errors;


    switch(name){
        case 'matric_num':
              matricNum_valid = value.match(/^\d{2}\/\d{4}$/) || value.match(/^\d{6}$/);
              Errors.C_matricNum = matricNum_valid ? "" : "Improper format";
              if(this.state.matric_num===""){
                matricNum_valid = false;
                Errors.C_matricNum = matricNum_valid ? "" : "Please input your Matriculation Number/Application ID"
              }
              break;
        case 'password':
            password_valid = value.length >= 6;
            Errors.C_password = password_valid ? "": "Password too short";
            if(this.state.password === ""){
                password_valid = false;
                Errors.C_password = password_valid ? "": "Please input your password"
            }
            break;
            default:
                break;

    }
    this.setState({
        password_valid:password_valid,
        matricNum_valid:matricNum_valid,
        Errors:Errors
    },this.confirmValidation);
}
confirmValidation(){
    this.setState({
        formValid: this.state.matricNum_valid && this.state.password_valid
    })
}


handleSubmit=(e)=>{
    e.preventDefault();
    Axios.post('http://localhost:5000/logIn',{
        matric_num:this.state.matric_num,
        password:this.state.password
    }).then((response)=>{
        console.log("Server response: ", response);
        if(response.status === 200){
            const { username, success } = response.data;
            console.log("Successfully Validated");
            console.log(username);
            this.setState({username:username, result:success, homesRender:true});
            console.log("username in sign in: ", this.state.username)
        }else{
            console.log(response.status);
        }
    }).catch((err)=>{
        console.error(err.message);
        if(err.message === "Request failed with status code 401"){
            window.alert("Invalid Details");
        }
    })
 }
 
    render(){
        return(
            <div> 
              <div className="container">
                <img  id="background_logo" src={logo} alt="background logo"/>
                <form className="form" onSubmit={(e)=>this.handleSubmit(e)}>
                   <h1 className="header">Sign In</h1>
                   <label htmlFor="Matric_num">Matric Number/Application ID</label>
                   <label className="errors">{this.state.Errors.C_matricNum}</label>
                   <input type="text" id="matric_num" onChange={(e)=>this.handleChange(e)}/>
                   <label htmlFor="password">Password</label>
                   <label className="errors">{this.state.Errors.C_password}</label>
                   <input type="password" id="password" onChange={(e)=>this.handleChange(e)}/>
                   {this.state.formValid? (<label className="submitting_confirmed">Good to go!!!</label>) : (<label className="submitting_confirmation">Ensure all fields are filled</label>)}
                   <button className="submit" disabled={!this.state.formValid}>{"Log In"}{(this.state.result===true?true:false) && (this.state.username===""?false:true) && <Navigate to="/home"/>}</button>
                   <p id="signIn_link">Don't have an account? Sign up <a className="links" href="/signUp">here</a></p>
                </form>
                </div>
                <span style={{visibility:'hidden'}}><Home username={this.state.username}/></span>
            </div>
        );
    }
}
export default SignIn;