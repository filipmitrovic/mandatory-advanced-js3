import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Navbar from './components/navbar';
import Login from './components/login';
import Register from './components/register';
import Todo from './components/todo'; 

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Navbar />
          <Route exact path='/' component={Login} />
          <Route path='/register' component={Register} />
          <Route path='/todo' component={Todo} />
        </div>
      </Router>
    );
  }
}

export default App;