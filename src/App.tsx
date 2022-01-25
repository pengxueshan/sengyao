import React, { useEffect } from 'react';
import './App.css';
import Water from './utils/water';

function App() {
  useEffect(() => {
    const w = new Water({
      id: 'wrapper',
    });
    w.render();
  }, []);
  return <div className="App" id="wrapper"></div>;
}

export default App;
