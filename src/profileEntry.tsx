import React from 'react';
import ReactDOM from 'react-dom/client';
import { ProfilePage } from './components/ProfilePage';
import './index.css';

ReactDOM.createRoot(document.getElementById('profile-root')!).render(
  <React.StrictMode>
    <ProfilePage />
  </React.StrictMode>
);
