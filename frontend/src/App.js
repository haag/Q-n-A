import React, { Component } from 'react';
import NavBar from './components/Navbar'
import Questions from './components/Questions'
import Question from './components/Question'
import {Route} from 'react-router-dom'
import Callback from './components/Callback';

class App extends Component {
  render() {
    return (
      <div>
        <NavBar />
        <Route exact path='/' component={Questions} />
        <Route exact path='/question/:questionId' component={Question} />
        <Route exact path='/callback' component={Callback} />
      </div>
    );
  }
}

export default App;
