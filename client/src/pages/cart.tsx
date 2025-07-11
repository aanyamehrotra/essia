import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { useCartWithStrapiProducts } from '../hooks/useCartWithStrapiProducts';
import { useToast } from '../hooks/use-toast';
import { formatPrice } from '../lib/utils';
import { Minus, Plus, Trash2, Loader2, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type CartItem = {
  cartItemId: number;
  productId: number;
  name: string;
  price: number;
  description: string;
  image: string;
  quantity: number;
};

export default function Cart() {
  const {
    cartItems,
    cartTotal,
    updateQuantity,
    removeFromCart,
    isLoading,
  } = useCartWithStrapiProducts() as {
    cartItems: CartItem[];
    cartTotal: number;
    updateQuantity: (cartItemId: number, newQuantity: number) => Promise<void>;
    removeFromCart: (cartItemId: number) => Promise<void>;
    isLoading: boolean;
  };

  const { toast } = useToast();
  const [updatingItems, setUpdatingItems] = useState<Set<number>>(new Set());

  const handleQuantityChange = async (
    cartItemId: number,
    productName: string,
    newQuantity: number
  ) => {
    setUpdatingItems((prev) => new Set([...Array.from(prev), cartItemId]));

    try {
      if (newQuantity <= 0) {
        await removeFromCart(cartItemId);
        toast({
          title: 'Removed from Cart',
          description: `${productName} was removed.`,
          variant: 'default',
        });
      } else {
        await updateQuantity(cartItemId, newQuantity);
        toast({
          title: 'Quantity Updated',
          description: `Updated to ${newQuantity} for "${productName}"`,
          variant: 'success',
        });
      }
    } catch {
      toast({
        title: 'Error',
        description: `Could not update "${productName}".`,
        variant: 'destructive',
      });
    } finally {
      setUpdatingItems((prev) => {
        const updated = new Set(prev);
        updated.delete(cartItemId);
        return updated;
      });
    }
  };

  const handleRemoveItem = async (cartItemId: number, productName: string) => {
    if (!confirm(`Remove "${productName}" from your cart?`)) return;

    try {
      await removeFromCart(cartItemId);
      toast({
        title: 'Item Removed',
        description: `${productName} was removed.`,
        variant: 'default',
      });
    } catch {
      toast({
        title: 'Error',
        description: `Could not remove "${productName}".`,
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-6 flex space-x-4">
                <div className="h-24 w-24 bg-gray-200 rounded" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!cartItems.length) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ShoppingBag className="mx-auto h-24 w-24 text-purple-primary/20 mb-8 animate-bounce" />
          <h1 className="text-3xl font-serif font-bold text-purple-dark mb-4">Your Cart is Empty</h1>
          <p className="text-purple-dark/70 mb-8 text-lg">
            Looks like you haven't added any candles to your cart yet.
          </p>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Link href="/products">
              <Button className="bg-purple-primary text-white hover:bg-purple-primary/90 px-8 py-3">
                Start Shopping
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Sticky Header on Mobile */}
      <div className="sticky top-0 z-20 bg-gray-50 border-b px-4 py-4 lg:hidden">
        <h1 className="text-xl font-bold font-serif text-purple-dark">
          Cart ({cartItems.length} item{cartItems.length > 1 ? 's' : ''})
        </h1>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence mode="popLayout">
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.cartItemId}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="shadow-md border border-gray-200">
                    <CardContent className="p-6">
                      <div className="grid grid-cols-[auto_1fr_auto] gap-4 items-center">
                        <Link href={`/products/${item.productId}`}>
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-24 w-24 rounded-lg object-cover transition-transform hover:scale-105 cursor-pointer"
                          />
                        </Link>

                        <div className="min-w-0 space-y-1">
                          <Link href={`/products/${item.productId}`}>
                            <h3 className="text-lg font-semibold text-purple-dark hover:text-purple-primary transition-colors cursor-pointer">
                              {item.name}
                            </h3>
                          </Link>
                          <p className="text-sm text-purple-dark/60 line-clamp-2">{item.description}</p>

                          <div className="flex items-center gap-3 mt-2">
                            <div className="flex items-center border rounded overflow-hidden">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                aria-label="Decrease quantity"
                                onClick={() =>
                                  handleQuantityChange(item.cartItemId, item.name, item.quantity - 1)
                                }
                                disabled={updatingItems.has(item.cartItemId)}
                              >
                                {updatingItems.has(item.cartItemId) ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Minus className="h-4 w-4" />
                                )}
                              </Button>
                              <span className="w-8 text-center font-medium text-purple-dark text-sm">
                                {item.quantity}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                aria-label="Increase quantity"
                                onClick={() =>
                                  handleQuantityChange(item.cartItemId, item.name, item.quantity + 1)
                                }
                                disabled={updatingItems.has(item.cartItemId)}
                              >
                                {updatingItems.has(item.cartItemId) ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Plus className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end justify-between h-full gap-2">
                          <span className="text-lg font-bold text-purple-dark">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-700"
                            aria-label={`Remove ${item.name}`}
                            onClick={() => handleRemoveItem(item.cartItemId, item.name)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 bg-white border shadow-sm rounded-xl">
              <CardHeader>
                <CardTitle className="text-purple-dark">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-purple-dark/80">
                  <span>Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-purple-dark/80">
                  <span>Shipping</span>
                  <span className="text-green-600">
                    {total >= 50 ? 'Free' : formatPrice(5.99)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold text-purple-dark">
                  <span>Total</span>
                  <span>{formatPrice(total + (total >= 50 ? 0 : 5.99))}</span>
                </div>

                {total < 50 && (
                  <p className="text-sm text-center text-purple-dark bg-purple-light/30 p-3 rounded-md">
                    Add {formatPrice(50 - total)} more for free shipping!
                  </p>
                )}

                <Link href="/checkout">
                  <Button
                    className="w-full bg-purple-primary text-white hover:bg-purple-primary/90 py-3 text-lg font-semibold"
                    disabled={updatingItems.size > 0}
                  >
                    Proceed to Checkout
                  </Button>
                </Link>

                <Link href="/products">
                  <Button
                    variant="outline"
                    className="w-full border-purple-primary text-purple-primary hover:bg-purple-primary hover:text-white"
                  >
                    Continue Shopping
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
