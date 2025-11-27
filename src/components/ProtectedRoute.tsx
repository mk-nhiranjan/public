import React, { useState } from 'react';
import {  useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';
import LoginModal from './LoginModal';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);

  if (isAuthenticated()) {
    return <>{children}</>;
  }

  // Show modal prompting user to login. If they cancel, navigate away.
  return (
    <>
      <LoginModal open={open} onClose={() => { setOpen(false); navigate('/dashboard'); }} />
    </>
  );
};

export default ProtectedRoute;
