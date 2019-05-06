import React, { Component } from "react";
import { Helmet } from "react-helmet";
import { token$ } from "./store";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { updateToken } from "./store";
import '../App.css'

class Todo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      username: '',
      content: '',
      loggedOut: false,
      noToken: false,
    };
    this.getData = this.getData.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.LogOut = this.LogOut.bind(this);
    this.onChange = this.onChange.bind(this);
    this.deleteTodo = this.deleteTodo.bind(this);
  }
  componentWillMount() {
    if (!token$.value) { this.setState({ noToken: true })};
    this.getData();
  }
  getData() {
    this.source = axios.CancelToken.source();
    let API_ROOT = 'http://ec2-13-53-32-89.eu-north-1.compute.amazonaws.com:3000';
    axios.get(API_ROOT + '/todos', {
        headers: { Authorization: 'Bearer ' + token$.value, cancelToken: this.source.token }})
      .then(res => {
        this.setState({ data: res.data.todos });
      })
      .catch(err => { console.log(err) });
  }
  onSubmit(e) {
    e.preventDefault();
    let API_ROOT = 'http://ec2-13-53-32-89.eu-north-1.compute.amazonaws.com:3000';
    axios.post( API_ROOT + '/todos', { content: this.state.content }, { headers: { Authorization: 'Bearer ' + token$.value, cancelToken: this.source.token }})
      .then(res => {
        this.getData();
        this.setState({ content: '' });
      });
  }
  LogOut(e) {
    e.preventDefault();
    this.setState({ loggedOut: true });
  }
  onChange(e) {
    this.setState({ content: e.target.value });
  }
  deleteTodo(id) {
    let API_ROOT = 'http://ec2-13-53-32-89.eu-north-1.compute.amazonaws.com:3000';
    axios.delete(API_ROOT + '/todos/' + id, { headers: { Authorization: 'Bearer ' + token$.value, cancelToken: this.source.token }})
    .then(res => {
      this.getData();
    })
    .catch(err => {
      console.log(err);
      this.getData();
    });
  }
  componentWillUnmount() {
    updateToken(null);
    this.source.cancel();
  }
  render() {        
    if (this.state.loggedOut || this.state.noToken) {
      return <Redirect to='/' />;
    }
    let todosList;
    if (this.state.data.length > 0) {
      todosList = this.state.data.map(todo => {
        return (
          <div className="border" key={todo.id}>
            <span>{todo.content}</span>
            <button onClick={() => { this.deleteTodo(todo.id) }}>remove</button>
          </div>
        );
      })
    } else {
      todosList = <p>No todos added, please add todo</p>
    }
    return (
      <>
        <Helmet>
          <title>Todo</title>
        </Helmet>
        <button onClick={this.LogOut}>Log out</button>
        <div className="border">{todosList}</div>
        <form onSubmit={this.onSubmit}>
          <label>todo name</label>
          <input onChange={this.onChange} value={this.state.content} type="text"/><br/>
          <button type="submit">add todo</button>
        </form>
      </>
    );
  }
}
export default Todo;
