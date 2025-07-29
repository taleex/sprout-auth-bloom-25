
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Account = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the new profile page
    navigate('/profile', { replace: true });
  }, [navigate]);

  return null;
};

export default Account;
