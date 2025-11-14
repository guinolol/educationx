"use client";

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/supabase';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/components/SessionProvider';
import { Navigate } from 'react-router-dom';

const Login = () => {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return null; // O SessionProvider já lida com o estado de carregamento
  }

  // Se o usuário já estiver logado, redireciona para o dashboard
  if (session) {
    return <Navigate to="/aprendizado" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900 dark:to-blue-900 p-4">
      <Card className="p-8 max-w-md w-full shadow-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-purple-600 dark:text-purple-300">
          Acesse sua Jornada
        </h1>
        <Auth
          supabaseClient={supabase}
          providers={[]}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: 'hsl(240 5.9% 10%)', // Cor primária escura
                  brandAccent: 'hsl(240 5.9% 10%)', // Cor de destaque
                },
              },
            },
          }}
          theme="light"
          redirectTo={window.location.origin + '/aprendizado'}
        />
      </Card>
    </div>
  );
};

export default Login;