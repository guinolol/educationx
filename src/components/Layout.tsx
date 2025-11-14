import { Outlet, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Home, BookOpen, Target, User, 
  Trophy, Zap, Menu, X 
} from "lucide-react";
import { useState } from "react";

const Layout = () => {
  const location = useLocation();
  const [menuAberto, setMenuAberto] = useState(false);

  const navegacao = [
    { path: "/", label: "Home", icon: Home },
    { path: "/quiz", label: "Quiz", icon: Target },
    { path: "/recomendacoes", label: "Recomendações", icon: Zap },
    { path: "/aprendizado", label: "Aprendizado", icon: BookOpen },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900 dark:to-blue-900">
      {/* Header com Navegação */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Educação Inteligente
              </span>
            </Link>

            {/* Navegação Desktop */}
            <nav className="hidden md:flex items-center gap-2">
              {navegacao.map((item) => (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive(item.path) ? "default" : "ghost"}
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                </Link>
              ))}
            </nav>

            {/* Menu Mobile */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMenuAberto(!menuAberto)}
              >
                {menuAberto ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Navegação Mobile */}
          {menuAberto && (
            <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4">
              <nav className="flex flex-col gap-2">
                {navegacao.map((item) => (
                  <Link key={item.path} to={item.path} onClick={() => setMenuAberto(false)}>
                    <Button
                      variant={isActive(item.path) ? "default" : "ghost"}
                      size="sm"
                      className="w-full justify-start"
                    >
                      <item.icon className="w-4 h-4 mr-2" />
                      {item.label}
                    </Button>
                  </Link>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white/50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Educação Inteligente</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Aprenda do seu jeito com tecnologia de ponte e personalização inteligente.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Links Rápidos</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/quiz" className="text-gray-600 dark:text-gray-300 hover:text-purple-600">Quiz de Personalização</Link></li>
                <li><Link to="/aprendizado" className="text-gray-600 dark:text-gray-300 hover:text-purple-600">Dashboard de Aprendizado</Link></li>
                <li><Link to="/recomendacoes" className="text-gray-600 dark:text-gray-300 hover:text-purple-600">Recomendações</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Progresso</h3>
              <Card className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Seu Progresso</span>
                  <span className="text-sm font-semibold">25%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                </div>
              </Card>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © 2024 Educação Inteligente. Feito com Dyad.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;