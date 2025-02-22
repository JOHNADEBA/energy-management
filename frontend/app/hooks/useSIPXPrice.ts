import { useState, useEffect } from "react";

export const useSIPXPrice = () => {
  const [sipxPrice, setSipxPrice] = useState<number>(0);

  useEffect(() => {
    const generateRandomSipxPrice = () => {
      const randomPrice = parseFloat((Math.random() * 100).toFixed(2)); // Random price between 0 and 100
      setSipxPrice(randomPrice);
    };

    generateRandomSipxPrice();
    const intervalId = setInterval(generateRandomSipxPrice, 3600000); // Update every hour

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  return sipxPrice;
};
