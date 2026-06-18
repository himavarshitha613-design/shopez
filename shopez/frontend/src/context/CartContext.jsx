import React, { createContext, useContext, useState, useCallback } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = useCallback((product, size = 'M', qty = 1) => {
    setCart(prev => {
      const existing = prev.find(i => i.product === product._id && i.size === size);
      if (existing) {
        return prev.map(i =>
          i.product === product._id && i.size === size
            ? { ...i, quantity: i.quantity + qty }
            : i
        );
      }
      return [...prev, {
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        mrp: product.mrp,
        size,
        quantity: qty,
      }];
    });
  }, []);

  const removeFromCart = useCallback((productId, size) => {
    setCart(prev => prev.filter(i => !(i.product === productId && i.size === size)));
  }, []);

  const updateQty = useCallback((productId, size, quantity) => {
    if (quantity <= 0) { removeFromCart(productId, size); return; }
    setCart(prev => prev.map(i =>
      i.product === productId && i.size === size ? { ...i, quantity } : i
    ));
  }, [removeFromCart]);

  const clearCart = useCallback(() => setCart([]), []);

  const totalMRP = cart.reduce((s, i) => s + i.mrp * i.quantity, 0);
  const totalPrice = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const totalDiscount = totalMRP - totalPrice;
  const itemCount = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart, addToCart, removeFromCart, updateQty, clearCart,
      totalMRP, totalPrice, totalDiscount, itemCount,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
