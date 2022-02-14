import React, { useEffect } from 'react';
import './App.css';
import Water from './utils/water';
import Shoot from './utils/shoot';
import Matrix from './utils/matrix';

function App() {
  useEffect(() => {
    const w = new Water({
      id: 'water',
    });
    w.render();
    const s = new Shoot({
      id: 'shooter',
    });
    s.render();
    const m = new Matrix({
      id: 'matrix',
    });
    m.render();
  }, []);
  return (
    <>
      <div id="water"></div>
      <div id="shooter"></div>
      <div id="matrix"></div>
    </>
  );
}

export default App;
