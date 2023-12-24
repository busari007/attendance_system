
import React from "react";

class Home extends React.Component {
  constructor(props){
    super(props);
    this.state= {
      username:this.props.username,
    };
  }

  render() {

    return (
      <div>
        <h2>User Data in Home Component</h2>
        {/* <nav className="nav">
      <div className="navbarContainer">
        <h3 className="logo">Your Logo</h3>
        <ul className="navLinks">
          <li><h4 className="navLink">Home</h4></li>
          <li><h4 className="navLink">About</h4></li>
          <li><h4 className="navLink">Services</h4></li>
          <li><h4 className="navLink">Contact</h4></li>
        </ul>
      </div>
    </nav> */}
        <button onClick={() => console.log(this.props.username)}>Click</button>
      </div>
    );
  }
}

export default Home;
