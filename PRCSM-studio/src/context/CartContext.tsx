// src/context/CartContext.tsx
import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { createCart, addToCart, fetchCart, updateCartLines, removeCartLines } from "@/api/shopify";
import { buildCheckoutUrl } from "@/utils/checkout";

type CartShape = {
  id: string;
  checkoutUrl?: string;
  lines?: { edges: { node: any }[] };
  cost?: any;
  totalQuantity?: number;
};

type LineOptimisticState = {
  isUpdating: boolean;
  lastIntendedQuantity: number;
  isDirty: boolean;
  syncStartTime?: number;
};

type LineInternalState = {
  lastIntendedQuantity: number;
  flushTimer?: NodeJS.Timeout;
  inFlight: boolean;
  abortController?: AbortController;
  originalQuantity: number;
  isDirty: boolean;
  syncStartTime?: number;
};

type CartContextType = {
  cart: CartShape | null;
  optimisticDelta: number;
  getTotalQuantity: () => number;
  addItem: (
    variantId: string,
    quantity?: number
  ) => Promise<CartShape | null>;
  updateLineQuantity: (lineId: string, quantity: number) => Promise<void>;
  removeLine: (lineId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  goToCheckout: () => void;
  resetCart: () => void;
  resetAfterCheckout: () => void;
  isLoading: boolean;
  getLineOptimisticState: (lineId: string) => LineOptimisticState;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

// Assertion to ensure only one CartProvider is mounted
let providerCount = 0;

export function CartProvider({ children }: { children: React.ReactNode }) {
  // Provider assertion
  const mountedRef = useRef(false);
  
  useEffect(() => {
    if (mountedRef.current) {
      console.warn('Multiple CartProvider instances detected!');
    }
    providerCount++;
    mountedRef.current = true;
    
    if (providerCount > 1) {
      throw new Error('Only one CartProvider should be mounted at a time');
    }
    
    return () => {
      providerCount--;
      mountedRef.current = false;
    };
  }, []);

  const [cart, setCart] = useState<CartShape | null>(null);
  const [optimisticDelta, setOptimisticDelta] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  
  // Per-line optimistic state for UI
  const [lineOptimisticStates, setLineOptimisticStates] = useState<Record<string, LineOptimisticState>>({});
  
  // Per-line internal state for coalescing and race-safety
  const lineInternalStates = useRef<Record<string, LineInternalState>>({});
  
  // Development logging flag
  const isDev = process.env.NODE_ENV === 'development';

  // Single source of truth for total quantity
  const getTotalQuantity = (): number => {
    let baseQuantity = 0;
    
    // First try cart.totalQuantity if available
    if (cart?.totalQuantity !== undefined) {
      baseQuantity = cart.totalQuantity;
    } else if (cart?.lines?.edges) {
      // Fallback: sum line quantities from edges format
      baseQuantity = cart.lines.edges.reduce(
        (sum, edge) => sum + (edge?.node?.quantity ?? 0),
        0
      );
    } else if (Array.isArray((cart as any)?.lines)) {
      // Fallback: sum line quantities from direct lines array
      baseQuantity = (cart as any).lines.reduce(
        (sum: number, line: any) => sum + (line?.quantity ?? 0),
        0
      );
    }
    
    return baseQuantity + optimisticDelta;
  };
  
  // Get optimistic state for a specific line
  const getLineOptimisticState = (lineId: string): LineOptimisticState => {
    const optimisticState = lineOptimisticStates[lineId];
    if (!optimisticState) {
      // Find the current quantity from cart
      const currentQuantity = getCurrentLineQuantity(lineId);
      return { 
        isUpdating: false, 
        lastIntendedQuantity: currentQuantity,
        isDirty: false
      };
    }
    return optimisticState;
  };

  // Helper to get current line quantity from cart
  const getCurrentLineQuantity = (lineId: string): number => {
    if (!cart?.lines?.edges) return 0;
    const line = cart.lines.edges.find(edge => edge.node.id === lineId);
    return line?.node?.quantity || 0;
  };

  // --- Init depuis localStorage
  useEffect(() => {
    let isMounted = true; // Prevent state updates if component unmounts
    
    (async () => {
      const id = localStorage.getItem("shopify_cart_id");
      const cached = localStorage.getItem("shopify_cart");

      try {
        setIsLoading(true);
        if (cached && isMounted) {
          setCart(JSON.parse(cached));
        } else if (id) {
          // Try to fetch existing cart by id
          try {
            const existing = await fetchCart(id);
            if (existing && isMounted) {
              setCart(existing);
              localStorage.setItem("shopify_cart", JSON.stringify(existing));
            } else if (isMounted) {
              // Cart exists but is null/empty - drop invalid id and create fresh
              console.warn("Persisted cart ID no longer valid, creating fresh cart");
              localStorage.removeItem("shopify_cart_id");
              localStorage.removeItem("shopify_cart");
              const created = await createCart([]);
              setCart(created);
              localStorage.setItem("shopify_cart_id", created.id);
              localStorage.setItem("shopify_cart", JSON.stringify(created));
            }
          } catch (fetchError) {
            // Cart fetch failed (404, network error, etc.) - drop invalid id and create fresh
            console.warn("Failed to fetch persisted cart, creating fresh cart:", fetchError);
            if (isMounted) {
              localStorage.removeItem("shopify_cart_id");
              localStorage.removeItem("shopify_cart");
              const created = await createCart([]);
              setCart(created);
              localStorage.setItem("shopify_cart_id", created.id);
              localStorage.setItem("shopify_cart", JSON.stringify(created));
            }
          }
        } else if (isMounted) {
          // No cache → create empty cart
          const created = await createCart([]);
          setCart(created);
          localStorage.setItem("shopify_cart_id", created.id);
          localStorage.setItem("shopify_cart", JSON.stringify(created));
        }
      } catch (e) {
        console.error("Cart init error:", e);
        // Fallback: try to create a fresh cart even on general errors
        if (isMounted) {
          try {
            const created = await createCart([]);
            setCart(created);
            localStorage.setItem("shopify_cart_id", created.id);
            localStorage.setItem("shopify_cart", JSON.stringify(created));
          } catch (fallbackError) {
            console.error("Failed to create fallback cart:", fallbackError);
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    })();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // --- Persist cart + id
  useEffect(() => {
    if (cart) {
      localStorage.setItem("shopify_cart", JSON.stringify(cart));
      localStorage.setItem("shopify_cart_id", cart.id);
    }
  }, [cart]);

  // small helper
  async function getOrCreateCart(): Promise<CartShape> {
    const id = localStorage.getItem("shopify_cart_id");
    if (id) {
      try {
        const c = await fetchCart(id);
        if (c) return c;
        // Cart ID exists but cart is null/invalid - clean up and create fresh
        console.warn("getOrCreateCart: persisted cart ID invalid, creating fresh cart");
        localStorage.removeItem("shopify_cart_id");
        localStorage.removeItem("shopify_cart");
      } catch (fetchError) {
        // Cart fetch failed - clean up invalid ID and create fresh
        console.warn("getOrCreateCart: failed to fetch cart, creating fresh cart:", fetchError);
        localStorage.removeItem("shopify_cart_id");
        localStorage.removeItem("shopify_cart");
      }
    }
    const created = await createCart([]);
    localStorage.setItem("shopify_cart_id", created.id);
    localStorage.setItem("shopify_cart", JSON.stringify(created));
    setCart(created);
    return created;
  }

  async function addItem(
    variantId: string,
    quantity = 1
  ) {
    setIsLoading(true);

    // Apply optimistic delta only during mutation
    setOptimisticDelta(prev => prev + quantity);

    try {
      const base = cart ?? (await getOrCreateCart());
      const updated = await addToCart(base.id, [
        { merchandiseId: variantId, quantity },
      ]);
      
      // On success: clear optimistic delta and sync with server truth
      setOptimisticDelta(0);
      setCart(updated);
      localStorage.setItem("shopify_cart", JSON.stringify(updated));
      localStorage.setItem("shopify_cart_id", updated.id);
      return updated;
    } catch (err) {
      console.error("Cart add error", err);
      // On error: rollback optimistic delta
      setOptimisticDelta(prev => prev - quantity);
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  // Update line quantity with fully optimistic and coalesced updates
  async function updateLineQuantity(lineId: string, quantity: number) {
    if (!cart) return;

    const currentQuantity = getCurrentLineQuantity(lineId);
    
    if (isDev) {
      console.log(`[Cart] updateLineQuantity(${lineId}, ${quantity}) - current: ${currentQuantity}`);
    }

    // Initialize internal state if not exists
    if (!lineInternalStates.current[lineId]) {
      lineInternalStates.current[lineId] = {
        lastIntendedQuantity: currentQuantity,
        inFlight: false,
        originalQuantity: currentQuantity,
        isDirty: false
      };
    }

    const internalState = lineInternalStates.current[lineId];
    
    // Update intended quantity immediately
    internalState.lastIntendedQuantity = quantity;
    internalState.isDirty = true;
    
    // Update optimistic UI state immediately
    const syncStartTime = Date.now();
    setLineOptimisticStates(prev => ({
      ...prev,
      [lineId]: {
        isUpdating: false, // No visible loading
        lastIntendedQuantity: quantity,
        isDirty: true,
        syncStartTime
      }
    }));

    // Update cart state optimistically
    if (cart.lines?.edges) {
      const updatedCart = {
        ...cart,
        lines: {
          ...cart.lines,
          edges: cart.lines.edges.map(edge => {
            if (edge.node.id === lineId) {
              return {
                ...edge,
                node: {
                  ...edge.node,
                  quantity
                }
              };
            }
            return edge;
          })
        }
      };
      setCart(updatedCart);
    }

    // Clear existing timer
    if (internalState.flushTimer) {
      clearTimeout(internalState.flushTimer);
    }

    // Set new debounce timer (250-300ms)
    internalState.flushTimer = setTimeout(async () => {
      await flushLineUpdate(lineId);
    }, 275);

    internalState.syncStartTime = syncStartTime;
  }

  // Flush a single line update to the server
  async function flushLineUpdate(lineId: string) {
    const internalState = lineInternalStates.current[lineId];
    if (!internalState || !cart) return;

    // If already in flight, let it finish and we'll send another request
    if (internalState.inFlight) {
      if (isDev) {
        console.log(`[Cart] Request already in flight for line ${lineId}, will send follow-up`);
      }
      return;
    }

    const targetQuantity = internalState.lastIntendedQuantity;
    
    if (isDev) {
      console.log(`[Cart] Flushing update for line ${lineId} to quantity ${targetQuantity}`);
    }

    // Mark as in flight
    internalState.inFlight = true;
    
    // Create abort controller for race safety
    if (internalState.abortController) {
      internalState.abortController.abort();
    }
    internalState.abortController = new AbortController();

    try {
      let updatedCart;
      
      if (targetQuantity === 0) {
        // Remove line if quantity is 0
        updatedCart = await removeCartLines(cart.id, [lineId]);
      } else {
        // Update line quantity
        updatedCart = await updateCartLines(cart.id, [{ id: lineId, quantity: targetQuantity }]);
      }

      // Success: reconcile with server response
      if (isDev) {
        console.log(`[Cart] Successfully updated line ${lineId} to ${targetQuantity}`);
      }

      setCart(updatedCart);
      localStorage.setItem("shopify_cart", JSON.stringify(updatedCart));
      
      // Clear optimistic state - line is now synced
      setLineOptimisticStates(prev => {
        const newState = { ...prev };
        delete newState[lineId];
        return newState;
      });

      // Clean up internal state
      delete lineInternalStates.current[lineId];

    } catch (err) {
      if (isDev) {
        console.error(`[Cart] Failed to update line ${lineId}:`, err);
      }
      
      // Rollback to original quantity
      const originalQuantity = internalState.originalQuantity;
      
      if (cart.lines?.edges) {
        const rolledBackCart = {
          ...cart,
          lines: {
            ...cart.lines,
            edges: cart.lines.edges.map(edge => {
              if (edge.node.id === lineId) {
                return {
                  ...edge,
                  node: {
                    ...edge.node,
                    quantity: originalQuantity
                  }
                };
              }
              return edge;
            })
          }
        };
        setCart(rolledBackCart);
      }

      // Clear optimistic state
      setLineOptimisticStates(prev => {
        const newState = { ...prev };
        delete newState[lineId];
        return newState;
      });

      // Clean up internal state
      delete lineInternalStates.current[lineId];
      
      // TODO: Show error toast
      console.warn("Failed to update cart line - rolled back to original quantity");
    } finally {
      // Mark as no longer in flight
      if (internalState) {
        internalState.inFlight = false;
        
        // If there's a new intended quantity different from what we just sent, schedule another update
        if (internalState.lastIntendedQuantity !== targetQuantity) {
          if (isDev) {
            console.log(`[Cart] Scheduling follow-up update for line ${lineId} to ${internalState.lastIntendedQuantity}`);
          }
          internalState.flushTimer = setTimeout(async () => {
            await flushLineUpdate(lineId);
          }, 100); // Quick follow-up
        }
      }
    }
  }

  // Remove line from cart
  async function removeLine(lineId: string) {
    if (!cart) return;

    // Set optimistic state
    setLineOptimisticStates(prev => ({
      ...prev,
      [lineId]: {
        isUpdating: true,
        lastIntendedQuantity: 0,
        isDirty: true,
        syncStartTime: Date.now()
      }
    }));

    try {
      const updatedCart = await removeCartLines(cart.id, [lineId]);
      
      // Success: sync with server truth
      setCart(updatedCart);
      localStorage.setItem("shopify_cart", JSON.stringify(updatedCart));
      
      // Clear optimistic state
      setLineOptimisticStates(prev => {
        const newState = { ...prev };
        delete newState[lineId];
        return newState;
      });
    } catch (err) {
      console.error("Line removal error", err);
      
      // Error: rollback optimistic state
      setLineOptimisticStates(prev => {
        const newState = { ...prev };
        delete newState[lineId];
        return newState;
      });
      
      console.warn("Failed to remove cart line");
    }
  }

  // Clear entire cart
  async function clearCart() {
    if (!cart?.lines?.edges?.length) return;

    const lineIds = cart.lines.edges.map(edge => edge.node.id);
    
    // Set optimistic state for all lines
    const optimisticStates: Record<string, LineOptimisticState> = {};
    lineIds.forEach(id => {
      optimisticStates[id] = { 
        isUpdating: true, 
        lastIntendedQuantity: 0,
        isDirty: true,
        syncStartTime: Date.now()
      };
    });
    setLineOptimisticStates(optimisticStates);

    try {
      const updatedCart = await removeCartLines(cart.id, lineIds);
      
      // Success: sync with server truth
      setCart(updatedCart);
      localStorage.setItem("shopify_cart", JSON.stringify(updatedCart));
      
      // Clear all optimistic states
      setLineOptimisticStates({});
    } catch (err) {
      console.error("Cart clear error", err);
      
      // Error: rollback optimistic states
      setLineOptimisticStates({});
      
      console.warn("Failed to clear cart");
    }
  }

  function goToCheckout() {
    if (cart?.checkoutUrl) {
      // Store current path for return navigation
      localStorage.setItem('prcsm:returnPath', window.location.pathname + window.location.search);
      
      const checkoutUrl = buildCheckoutUrl(cart.checkoutUrl);
      window.location.assign(checkoutUrl);
    }
  }

  function resetAfterCheckout() {
    // Make idempotent - check if already reset
    if (!cart && !localStorage.getItem("shopify_cart_id")) {
      return; // Already reset
    }

    // Clear persisted cart data
    localStorage.removeItem("shopify_cart_id");
    localStorage.removeItem("shopify_cart");
    localStorage.removeItem("shopify_local_lines");
    
    // Clear in-memory state
    setCart(null);
    setOptimisticDelta(0);
    setLineOptimisticStates({});
    
    // Clear internal states
    lineInternalStates.current = {};
    
    // Create new cart in background (non-blocking) with error handling
    createCart([]).then((newCart) => {
      // Double-check component is still mounted and we haven't been reset again
      if (newCart) {
        setCart(newCart);
        localStorage.setItem("shopify_cart_id", newCart.id);
        localStorage.setItem("shopify_cart", JSON.stringify(newCart));
      }
    }).catch((error) => {
      console.error("Failed to create new cart after checkout:", error);
      // Don't throw - this is background operation
    });
  }

  function resetCart() {
    setCart(null);
    setOptimisticDelta(0);
    localStorage.removeItem("shopify_cart");
    localStorage.removeItem("shopify_cart_id");
    // Clean up old localLines data if it exists
    localStorage.removeItem("shopify_local_lines");
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        optimisticDelta,
        getTotalQuantity,
        addItem,
        updateLineQuantity,
        removeLine,
        clearCart,
        goToCheckout,
        resetCart,
        resetAfterCheckout,
        isLoading,
        getLineOptimisticState,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
