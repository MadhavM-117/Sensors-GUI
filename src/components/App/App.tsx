import React from 'react';

import './App.css';
import {SensorListing} from '../Sensors/index';

const App: React.FC = () => {
  return (
    <div className="App">
      <SensorListing />
    </div>
  );
}

export default App;
