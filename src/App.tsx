import React from 'react';
import Dashboard from './components/Dashboard'
import FireBaseComponent from './utils/firebase';

function App() {
  return (
    <FireBaseComponent>
      <Dashboard/>
    </FireBaseComponent>
  );
}

export default App;
