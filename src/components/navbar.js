import React, { Component } from "react";
import { token$ } from "./store";
import jwt from "jsonwebtoken";

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
    };
  }
  componentDidMount() {
    this.subscription = token$.subscribe(token => {
      if (token) {
        const decoded = jwt.decode(token);
        this.setState({ username: decoded.email });
      } else { this.setState({ username: '' })}
    });
  }
  componentWillUnmount() {
    this.subscription.unsubscribe();
  }
  render() {
    return (
      <nav>
        <h1>Todo App</h1>
        <h3>{this.state.username}</h3>
      </nav>
    );
  }
}
export default Navbar;
