'use client';

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { ShoppingCart, Menu, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { useCart } from '../context/cart-context';
import { useAuthContext } from '../context/auth-context';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '../lib/queryClient';
import { useToast } from '../hooks/use-toast';
import { ProfileSlider } from './ProfileSlider';

export function Header() {
  const [location, setLocation] = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount } = useCart();
  const { user, isAuthenticated, isLoading, refetchUser } = useAuthContext();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const logoutMutation = useMutation({
    mutationFn: async () => await apiRequest("POST", "/api/users/logout"),
    onSuccess: async () => {
      await refetchUser();
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      sessionStorage.removeItem("login-toast-shown");
      toast({
        title: "👋 Logged out",
        description: "You have been logged out successfully.",
        variant: "info",
      });
      setLocation("/");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Logout failed",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (isAuthenticated && !sessionStorage.getItem("login-toast-shown")) {
      toast({
        title: "🎉 Welcome back!",
        description: "You are now logged in.",
        variant: "success",
      });
      sessionStorage.setItem("login-toast-shown", "true");
    }
  }, [isAuthenticated]);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const handleMobileNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    setLocation(href);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-purple-primary cursor-pointer">
                Essia
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4 lg:space-x-8">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href}>
                  <span
                    className={`font-medium transition-colors duration-200 cursor-pointer text-sm lg:text-base ${
                      location === item.href
                        ? 'text-purple-primary'
                        : 'text-purple-dark hover:text-purple-primary'
                    }`}
                  >
                    {item.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Auth Buttons - Desktop */}
            {!isLoading && isAuthenticated ? (
              <div className="hidden md:flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-purple-dark hover:text-purple-primary text-sm"
                  onClick={() => setIsProfileOpen(true)}
                >
                  Profile
                </Button>
                <Button
                  size="sm"
                  className="bg-purple-primary hover:bg-purple-dark text-white text-sm px-3"
                  onClick={() => logoutMutation.mutate()}
                  disabled={logoutMutation.isPending}
                >
                  {logoutMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Logout"
                  )}
                </Button>
              </div>
            ) : (
              !isLoading && (
                <div className="hidden md:flex items-center space-x-2">
                  <Link href="/login">
                    <Button variant="ghost" size="sm" className="text-purple-dark hover:text-purple-primary text-sm">
                      Login
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button size="sm" className="bg-purple-primary hover:bg-purple-dark text-white text-sm px-3">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )
            )}

            {/* Cart */}
            <Link href="/cart">
              <Button
                variant="ghost"
                size="icon"
                className="text-purple-dark hover:text-purple-primary relative h-9 w-9 sm:h-10 sm:w-10"
              >
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                {cartCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-purple-primary text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center p-0 text-[10px] sm:text-xs"
                  >
                    {cartCount > 99 ? '99+' : cartCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-purple-dark hover:text-purple-primary h-9 w-9"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[350px]">
                <div className="flex flex-col space-y-6 mt-6">
                  {/* Navigation Links */}
                  <div className="space-y-4">
                    {navigation.map((item) => (
                      <button
                        key={item.name}
                        onClick={() => handleMobileNavClick(item.href)}
                        className={`block text-left text-lg font-medium transition-colors duration-200 w-full ${
                          location === item.href
                            ? 'text-purple-primary'
                            : 'text-purple-dark hover:text-purple-primary'
                        }`}
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>

                  {/* Auth Section */}
                  <div className="border-t pt-6">
                    {!isLoading && isAuthenticated ? (
                      <div className="flex flex-col space-y-4">
                        <Button
                          variant="ghost"
                          className="justify-start text-purple-dark hover:text-purple-primary"
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            setIsProfileOpen(true);
                          }}
                        >
                          Profile
                        </Button>
                        <Button
                          className="bg-purple-primary hover:bg-purple-dark text-white"
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            logoutMutation.mutate();
                          }}
                          disabled={logoutMutation.isPending}
                        >
                          {logoutMutation.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          ) : null}
                          Logout
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col space-y-4">
                        <Button
                          variant="ghost"
                          className="justify-start text-purple-dark hover:text-purple-primary"
                          onClick={() => handleMobileNavClick('/login')}
                        >
                          Login
                        </Button>
                        <Button
                          className="bg-purple-primary hover:bg-purple-dark text-white"
                          onClick={() => handleMobileNavClick('/register')}
                        >
                          Sign Up
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Profile Sheet Drawer */}
      <ProfileSlider open={isProfileOpen} onOpenChange={setIsProfileOpen} />
    </header>
  );
}