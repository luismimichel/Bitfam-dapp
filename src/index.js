import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';
import User from './components/User';
import Header from './components/Header';
import Invest from './components/Invest';
import Footer from './components/Footer';
import Withdraw from './components/Withdraw';
import Refers from './components/Refers';
import Admin from './components/AdminComponent';
import './index.css';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Header/>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="user" element={<User />} />
          <Route path='invest' element={<Invest />} />
          <Route path='Withdraw' element={<Withdraw />} />
          <Route path='refers' element={<Refers />} />
        </Routes>
        </BrowserRouter>
        <Footer/>
      </Provider>
  </React.StrictMode>
);