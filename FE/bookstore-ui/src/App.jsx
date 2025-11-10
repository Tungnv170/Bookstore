import React, { useState } from 'react';
import MainLayout from './components/Layout/MainLayout';
import POSScreen from './components/POS/POSScreen';
import InventoryScreen from './components/Inventory/InventoryScreen';

function App() {
  const [currentScreen, setCurrentScreen] = useState('pos');

  return (
    <MainLayout
      currentScreen={currentScreen}
      onScreenChange={setCurrentScreen}
    >
      {currentScreen === 'pos' ? <POSScreen /> : <InventoryScreen />}
    </MainLayout>
  );
}

export default App;