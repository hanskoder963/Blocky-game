import { createContext, useContext, useMemo, useState } from "react";

const GameCtx = createContext(null);

export function GameProvider({ children }) {
  const [coins, setCoins] = useState(0);
  const [inventory, setInventory] = useState([]); // [{id,name,qty}]

  const addItem = (name, qty = 1) =>
    setInventory((list) => {
      const i = list.findIndex((x) => x.name === name);
      if (i >= 0) {
        const copy = list.slice();
        copy[i] = { ...copy[i], qty: copy[i].qty + qty };
        return copy;
      }
      return [...list, { id: crypto.randomUUID(), name, qty }];
    });

  const removeItem = (name, qty = 1) =>
    setInventory((list) =>
      list
        .map((x) => (x.name === name ? { ...x, qty: x.qty - qty } : x))
        .filter((x) => x.qty > 0)
    );

  const value = useMemo(
    () => ({ coins, setCoins, inventory, addItem, removeItem }),
    [coins, inventory]
  );

  return <GameCtx.Provider value={value}>{children}</GameCtx.Provider>;
}

export const useGame = () => {
  const ctx = useContext(GameCtx);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
};
