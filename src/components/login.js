import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet";
import { updateToken } from "./store";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      error: '',
      loggedIn: false,
    };
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  onSubmit(e) {
    e.preventDefault();
    this.source = axios.CancelToken.source();
    let API_ROOT = 'http://ec2-13-53-32-89.eu-north-1.compute.amazonaws.com:3000';
    axios
      .post( API_ROOT + '/auth', { email: this.state.username, password: this.state.password }, { headers: { cancelToken: this.source.token }})
      .then(res => {
        updateToken(res.data.token);
        window.localStorage.setItem('token', res.data.token);
        this.setState({loggedIn: true});
      })
      .catch(err => { this.setState({ error: 'Invalid username or password' })
    });
  }
  componentWillUnmount() {
    if (this.source) { this.source.cancel() }
  }
  onChangeUsername(e) { this.setState({ username: e.target.value })};
  onChangePassword(e) { this.setState({ password: e.target.value })};

  render() {
    if (this.state.loggedIn) {
      return <Redirect to='/todo' />;
    }
    return (
      <>
        <Helmet>
          <title>Home</title>
        </Helmet>
        <h4>Log In</h4>
        <form onSubmit={this.onSubmit}>
          <input type="email" id="email" onChange={this.onChangeUsername} value={this.state.username} />
          <label forhtml="email">Username</label> <br/>
          <input type="password" id="password" onChange={this.onChangePassword} value={this.state.password} />
          <label htmlFor="password">Password</label><br/>
          <span>{this.state.error}</span>
          <button type="submit">Login</button><br/>
          <Link to="/register">Register</Link>
        </form>
      </>
    );
  }
}
export default Home;
