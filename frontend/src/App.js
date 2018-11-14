import React, { Component } from 'react';
import NavBar from './components/Navbar'
import Questions from './components/Questions'
import Question from './components/Question'

class App extends Component {
  render() {
    return (
      <div>
        <NavBar />
        <Questions />
        <Question />
      </div>
    );
  }
}

export default App;
