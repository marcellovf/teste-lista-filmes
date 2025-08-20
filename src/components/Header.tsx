import Link from 'next/link';
import { Clapperboard, LogIn, LogOut, PlusCircle } from 'lucide-react';
import { getLoginStatus, logoutAction } from '@/app/actions';
import { useAuth } from '@/contexts/AuthContext';
import ThemeToggle from '@/components/ThemeToggle';

const Header = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    logout()
    logoutAction();
  };

  console

  return (
    <header className="bg-slate-800 shadow-md">
      <div className="container mx-auto px-4 py-4 flex flex-row max-[637px]:flex-col justify-between items-center gap-4">
        <Link href="/" className="flex items-center gap-2">
          <Clapperboard className="w-8 h-8 text-cyan-400" />
          <h1 className="text-2xl font-bold text-white">Catálogo de Filmes</h1>
        </Link>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />

          {user ? (
            <>
              <Link
                href="/add-movie"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <PlusCircle className="w-5 h-5" />
                Adicionar Filme
              </Link>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Sair
              </button>
            </>
          ) : (
            <Link 
              href="/"
              className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors"
            >
              <LogIn className="w-5 h-5" />
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
