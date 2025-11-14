"use client";

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './SessionProvider';
import { Loader2 } from 'lucide-react';

const ProtectedRoute: React.FC = () => {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (!session) {
    // Se não houver sessão, redireciona para a página de login
    return <Navigate to="/login" replace />;
  }

  // Se houver sessão, renderiza o conteúdo da rota
  return <Outlet />;
};

export default ProtectedRoute;