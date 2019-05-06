import React, { Component } from "react";
import { Helmet } from "react-helmet";
import { Redirect } from "react-router-dom";
import axios from "axios";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      repeatpw: "",
      error: "",
      registered: false,
    };
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onChangeRepeatPassword = this.onChangeRepeatPassword.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  onSubmit(e) {
    e.preventDefault();
    if (this.state.password !== this.state.repeatpw) return;
    let API_ROOT = "http://ec2-13-53-32-89.eu-north-1.compute.amazonaws.com:3000";
    axios
      .post(API_ROOT + "/register", { email: this.state.username, password: this.state.password })
      .then(res => {
        this.setState({ error: "" });
        this.setState({ registered: true });
      })
      .catch(err => {
        this.setState({ error: "Invalid password or username!" });
        console.log(err);
      });
  }
  onChangeUsername(e) {
    this.setState({ username: e.target.value });
  }
  onChangePassword(e) {
    this.setState({ password: e.target.value });
  }
  onChangeRepeatPassword(e) {
    this.setState({ repeatpw: e.target.value });
  }
  render() {
    if (this.state.registered) {
      return <Redirect to='/' />;
    }
    return (
      <>
        <Helmet>
          <title>Register</title>
        </Helmet>
        <h4>Register</h4>
        <form onSubmit={this.onSubmit}>
          <input type="email" id="email" value={this.state.username} onChange={this.onChangeUsername} />
          <label htmlFor="email">Username</label> <br/>
          <input type="password" id="password" value={this.state.password} onChange={this.onChangePassword} />
          <label htmlFor="password">Password</label> <br/>
          <input type="password" id="repeatPassword" value={this.state.repeatpw} onChange={this.onChangeRepeatPassword} />
          <label htmlFor="repeatPassword">Repeat Password</label> <br/>
          <span>{this.state.error}</span> <br/>
          <button type="submit">Submit</button>
        </form>
      </>
    );
  }
}
export default Register;
