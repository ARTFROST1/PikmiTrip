import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Route, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "@/components/auth-modal";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [location] = useLocation();
  const { user, isAuthenticated, isAgency, logout } = useAuth();

  const navigation = [
    { name: "Туры", href: "/tours" },
    { name: "О нас", href: "/about" },
    { name: "Блог", href: "/blog" },
    { name: "FAQ", href: "/faq" },
    { name: "Контакты", href: "/contact" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  };

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-sky-500 rounded-xl flex items-center justify-center">
              <Route className="text-white" size={20} />
            </div>
            <span className="text-xl font-bold gradient-text">
              Пикми трип
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href}>
                <span className={`cursor-pointer transition-colors ${
                  isActive(item.href)
                    ? "text-emerald-600"
                    : "text-gray-600 hover:text-emerald-600"
                }`}>
                  {item.name}
                </span>
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center space-x-4">
            <Button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              variant="ghost"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
            
            {isAuthenticated ? (
              <>
                {isAgency && (
                  <Link href="/admin">
                    <Button
                      variant="ghost"
                      className="hidden md:block text-gray-600 hover:text-emerald-600"
                    >
                      Админ
                    </Button>
                  </Link>
                )}
                
                <Link href="/profile">
                  <Button
                    variant="ghost"
                    className="hidden md:flex items-center space-x-2 text-gray-600 hover:text-emerald-600"
                  >
                    <User size={16} />
                    <span>{user?.firstName}</span>
                  </Button>
                </Link>
                
                <Button
                  variant="ghost"
                  className="hidden md:block text-gray-600 hover:text-red-600"
                  onClick={logout}
                >
                  Выйти
                </Button>
              </>
            ) : (
              <Button 
                onClick={() => setIsAuthModalOpen(true)}
                className="hidden md:block bg-gradient-to-r from-emerald-500 to-sky-500 text-white hover:from-emerald-600 hover:to-sky-600 transition-all duration-200 font-medium"
              >
                Войти
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200/50"
          >
            <div className="px-4 py-4 space-y-2">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href}>
                  <span
                    className={`block py-2 cursor-pointer transition-colors ${
                      isActive(item.href)
                        ? "text-emerald-600"
                        : "text-gray-600 hover:text-emerald-600"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </span>
                </Link>
              ))}
              
              {isAuthenticated ? (
                <>
                  {isAgency && (
                    <Link href="/admin">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-gray-600 hover:text-emerald-600"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Админ
                      </Button>
                    </Link>
                  )}
                  
                  <Link href="/profile">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-gray-600 hover:text-emerald-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User size={16} className="mr-2" />
                      Профиль
                    </Button>
                  </Link>
                  
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-600 hover:text-red-600"
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                  >
                    Выйти
                  </Button>
                </>
              ) : (
                <Button 
                  className="w-full bg-gradient-to-r from-emerald-500 to-sky-500 text-white hover:from-emerald-600 hover:to-sky-600 transition-all duration-200 font-medium"
                  onClick={() => {
                    setIsAuthModalOpen(true);
                    setIsMenuOpen(false);
                  }}
                >
                  Войти
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </motion.header>
  );
}
