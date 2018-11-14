import React, { Component } from 'react';
import NavBar from './components/Navbar'
import Questions from './components/Questions'


class App extends Component {
  render() {
    return (
      <div>
        <NavBar />
        <Questions />
  
      </div>
    );
  }
}

export default App;
