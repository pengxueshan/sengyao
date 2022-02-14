import React, { useEffect } from 'react';
import './App.css';
import Water from './utils/water';
import Shoot from './utils/shoot';

function App() {
  useEffect(() => {
    const w = new Shoot({
      id: 'wrapper',
    });
    w.render();
  }, []);
  return <div className="App" id="wrapper"></div>;
}

export default App;
