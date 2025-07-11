import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './page/LoginPage';
import Dashboard from './page/Dashboard';
import RoleAndRoot from './components/RoleAndRoot'
import MobileApp from './components/MobileApp'
import AddCategoryPage from './page/AddCategoryPage';
import DetailedStats from './page/DetailedStats';
import Partner from './page/Partner';
import CallPanel from './components/CallPanel';
import SwaggerPage from './components/SwaggerPage'
import './index.css';

function App() {
  return (
    <Routes>
      <Route path='/' element={<LoginPage />} />
      <Route path='/dashboard' element={<Dashboard />} />
      <Route path='/RoleAndRoot' element={<RoleAndRoot />} />
      <Route path='/docs' element={<SwaggerPage />} />
      <Route path='/calls' element={<CallPanel />} />
      <Route path="/statistics/:type" element={<DetailedStats />} />
      <Route path="/add-category" element={<AddCategoryPage />} />
      <Route path="/Partner" element={<Partner />} />
      <Route path='/mobile' element={<MobileApp />} />
    </Routes>
  );
}

export default App;