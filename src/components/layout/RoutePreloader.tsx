import React from 'react';
import { Link } from 'react-router-dom';

interface RoutePreloaderProps {
  routes: string[];
  children: React.ReactNode;
}

const RoutePreloader = ({ routes, children }: RoutePreloaderProps) => {
  return (
    <>
      {/* Preload common routes */}
      {routes.map((route) => (
        <Link
          key={route}
          to={route}
          style={{ display: 'none' }}
          aria-hidden="true"
        />
      ))}
      {children}
    </>
  );
};

export default RoutePreloader;