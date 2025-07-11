'use client';

import { LogOut, User, MapPin, Heart, ShoppingBag, History, Settings, HelpCircle, FileText, Star } from 'lucide-react';
import { Link } from 'wouter';
import { useAuthContext } from '../context/auth-context';
import { useToast } from '../hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '../lib/queryClient';
import { Button } from './ui/button';

export default function ProfileSidebar() {
  const { user, refetchUser } = useAuthContext();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const logoutMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/users/logout'),
    onSuccess: async () => {
      sessionStorage.removeItem('login-toast-shown');
      await refetchUser();
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
      toast({ title: 'Logged out', description: 'You have been successfully logged out.' });
    },
    onError: (error) => {
      toast({
        title: 'Logout failed',
        description: error.message || 'Please try again later.',
        variant: 'destructive',
      });
    },
  });

  const menuSections = [
    {
      title: 'My Account',
      items: [
        { icon: <User className="w-4 h-4" />, label: 'Personal Details', href: '/profile/details' },
        { icon: <MapPin className="w-4 h-4" />, label: 'Saved Addresses', href: '/profile/addresses' },
      ],
    },
    {
      title: 'My Store',
      items: [
        { icon: <ShoppingBag className="w-4 h-4" />, label: 'Orders', href: '/profile/orders' },
        { icon: <Heart className="w-4 h-4" />, label: 'Wishlist', href: '/profile/wishlist' },
      ],
    },
    {
      title: 'My Session',
      items: [
        { icon: <History className="w-4 h-4" />, label: 'Booking History', href: '/profile/history' },
      ],
    },
    {
      title: 'Chatbot',
      items: [
        { icon: <Settings className="w-4 h-4" />, label: 'Settings', href: '/profile/settings' },
      ],
    },
    {
      title: 'Help Center',
      items: [
        { icon: <HelpCircle className="w-4 h-4" />, label: 'Support', href: '/support' },
        { icon: <FileText className="w-4 h-4" />, label: 'FAQs', href: '/faqs' },
        { icon: <FileText className="w-4 h-4" />, label: 'Privacy Policy', href: '/privacy' },
        { icon: <FileText className="w-4 h-4" />, label: 'Terms of Service', href: '/terms' },
        { icon: <Star className="w-4 h-4" />, label: 'Rate Us', href: '/rate-us' },
      ],
    },
  ];

  return (
    <div className="w-full max-w-sm bg-white shadow-lg rounded-lg p-4 sm:p-5 space-y-4 sm:space-y-6">
      {/* User Info */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-purple-200 text-purple-700 flex items-center justify-center font-semibold text-base sm:text-lg">
          {user?.username?.charAt(0)?.toUpperCase() || "?"}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium truncate">{user?.username}</p>
          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
        </div>
      </div>

      {/* Menu Sections */}
      <div className="space-y-3 sm:space-y-4">
        {menuSections.map((section) => (
          <div key={section.title}>
            <p className="text-sm font-semibold text-gray-700 mb-2">{section.title}</p>
            <div className="space-y-1">
              {section.items.map((item) => (
                <Link key={item.label} href={item.href}>
                  <div className="flex items-center gap-3 px-2 sm:px-3 py-2 rounded-md hover:bg-purple-50 cursor-pointer transition text-sm">
                    {item.icon}
                    <span className="text-gray-800 truncate">{item.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Logout & Footer */}
      <div className="pt-2 border-t">
        <Button
          onClick={() => logoutMutation.mutate()}
          variant="ghost"
          className="w-full flex items-center justify-start gap-2 text-red-600 hover:bg-red-50 text-sm"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
        <div className="text-xs text-center text-gray-400 mt-2">V2.0 • Essia</div>
      </div>
    </div>
  );
}