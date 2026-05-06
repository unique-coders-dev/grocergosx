import { create } from 'zustand';
import { GroceryItem, Product } from '../types';

interface CartState {
  items: GroceryItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (product, quantity = 1) => {
    const currentItems = get().items;
    const existingItem = currentItems.find((item) => item.productId === product.id);

    if (existingItem) {
      set({
        items: currentItems.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        ),
      });
    } else {
      set({
        items: [
          ...currentItems,
          {
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity,
            imageUrl: product.imageUrl,
            unit: product.unit,
          },
        ],
      });
    }
  },
  removeItem: (productId) => {
    set({
      items: get().items.filter((item) => item.productId !== productId),
    });
  },
  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }
    set({
      items: get().items.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      ),
    });
  },
  clearCart: () => set({ items: [] }),
  getTotal: () => {
    return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
  },
}));
