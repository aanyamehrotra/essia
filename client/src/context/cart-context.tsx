import {
  createContext,
  ReactNode,
  useContext,
} from 'react';
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { apiRequest } from '../lib/queryClient';
import { useAuthContext } from './auth-context';

interface Product {
  id: number;
  documentId: string;
  name: string;
  description: string;
  image?: string;
  scent?: string;
  price: number;
  category?: string;
  inStock?: boolean;
}

interface CartItem {
  id: number;
  documentId: string;
  productId: number;
  productName: string;
  productPrice: number;
  productImage?: string;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  cartTotal: number;
  isLoading: boolean;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();
  const userId = user?.id;

  const { data: cartItems = [], isLoading } = useQuery<CartItem[]>({
    queryKey: ['/api/cart', userId],
    queryFn: async () => {
      if (!userId) return [];
      return apiRequest('GET', '/api/cart');
    },
    enabled: !!userId,
  });

  const addToCartMutation = useMutation({
    mutationFn: async (input: any) => apiRequest('POST', '/api/cart', input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/cart', userId] }),
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ cartItemId, quantity }: any) => {
      if (quantity <= 0) {
        await apiRequest('DELETE', `/api/cart/${cartItemId}`);
        return;
      }
      return apiRequest('PUT', `/api/cart/${cartItemId}`, { quantity });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/cart', userId] }),
  });

  const removeFromCartMutation = useMutation({
    mutationFn: (cartItemId: number) => apiRequest('DELETE', `/api/cart/${cartItemId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/cart', userId] }),
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      await Promise.all(cartItems.map((item) => apiRequest('DELETE', `/api/cart/${item.id}`)));
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/cart', userId] }),
  });

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cartItems.reduce((acc, item) => acc + item.productPrice * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        isLoading,
        addToCart: async (product, quantity = 1) =>
          addToCartMutation.mutateAsync({
            documentId: product.documentId,
            productId: product.id,
            productName: product.name,
            productPrice: product.price,
            productImage: product.image,
            quantity,
          }),
        updateQuantity: async (id, quantity) =>
          updateQuantityMutation.mutateAsync({ cartItemId: id, quantity }),
        removeFromCart: async (id) => removeFromCartMutation.mutateAsync(id),
        clearCart: async () => clearCartMutation.mutateAsync(),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}