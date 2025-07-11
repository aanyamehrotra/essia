// ProductCard.tsx
import { useLocation } from 'wouter';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useToast } from '../hooks/use-toast';
import { useCart } from '../context/cart-context';
import { useAuthContext } from '../context/auth-context';
import { formatPrice } from '../lib/utils';
import { Minus, Plus } from 'lucide-react';

interface Product {
  id: number;
  documentId: string;
  name: string;
  description: string;
  image: string;
  price: number;
  inStock?: boolean;
  featured?: boolean;
  scent?: string;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { cartItems, addToCart, updateQuantity, removeFromCart } = useCart();
  const cartItem = cartItems.find((item) => item.productId === product.id);
  const quantity = cartItem?.quantity || 0;

  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuthContext();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product.inStock || !product.documentId) return;

    if (!isAuthenticated) {
      toast({
        title: 'Login Required',
        description: 'Please log in to add items to your cart.',
        variant: 'destructive',
      });
      setLocation('/login');
      return;
    }

    try {
      await addToCart(product, 1);
      toast({ title: 'Added to Cart', description: `${product.name} added.` });
    } catch (error: any) {
      const errMsg = error?.message || 'Failed to add item.';
      toast({ title: 'Error', description: errMsg, variant: 'destructive' });
    }
  };

  const handleQuantityChange = async (newQty: number) => {
    if (!cartItem) return;

    try {
      if (newQty <= 0) {
        await removeFromCart(cartItem.id);
        toast({
          title: 'Removed from Cart',
          description: `${product.name} removed.`,
        });
      } else {
        await updateQuantity(cartItem.id, newQty);
        toast({
          title: 'Quantity Updated',
          description: `${product.name} → ${newQty}`,
        });
      }
    } catch (error: any) {
      toast({
        title: 'Update Failed',
        description: error?.message || 'Could not update quantity.',
        variant: 'destructive',
      });
    }
  };

  const navigateToProduct = () => {
    setLocation(`/products/${product.id}`);
  };

  return (
    <div
      onClick={navigateToProduct}
      className="group cursor-pointer flex flex-col justify-between h-full bg-white rounded-xl shadow-sm p-3 sm:p-4 transition hover:shadow-md"
    >
      <div className="relative overflow-hidden rounded-lg mb-3 sm:mb-4 h-48 sm:h-60">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.featured && (
          <Badge className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-purple-primary text-white text-xs">
            Best Seller
          </Badge>
        )}
        {product.inStock === false && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
            <Badge variant="secondary" className="text-white bg-gray-800 text-xs">
              Out of Stock
            </Badge>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 justify-between space-y-2">
        <div className="flex-1">
          <h4 className="font-semibold text-base sm:text-lg text-purple-dark mb-1 group-hover:text-purple-primary transition-colors line-clamp-2">
            {product.name}
          </h4>
          <p className="text-xs sm:text-sm text-purple-dark/60 line-clamp-2 mb-1">
            {product.description}
          </p>
          {product.scent && (
            <p className="text-xs sm:text-sm text-purple-primary font-medium">
              {product.scent}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <div className="flex justify-between items-center">
            <span className="text-lg sm:text-xl font-bold text-purple-primary">
              {formatPrice(product.price)}
            </span>
            {quantity > 0 ? (
              <div
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 sm:gap-2"
              >
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  className="h-7 w-7 sm:h-8 sm:w-8"
                  onClick={() => handleQuantityChange(quantity - 1)}
                >
                  <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
                <span className="w-6 text-center text-sm font-semibold">
                  {quantity}
                </span>
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  className="h-7 w-7 sm:h-8 sm:w-8"
                  onClick={() => handleQuantityChange(quantity + 1)}
                >
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="bg-purple-accent text-purple-dark hover:bg-purple-secondary transition-colors text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 h-auto"
              >
                Add to Cart
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}