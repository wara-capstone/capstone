import { useState } from "react";
import "./Button.css";

export default function AddToCartButton({ selectedCard }) {
  const [isCartItems, setIsCartItems] = useState(selectedCard.isCartItems);

  function addToCartHandler() {
    selectedCard.isCartItems = setIsCartItems(!isCartItems);
    console.log(selectedCard.isCartItems);
  }

  return (
    <button
      className={isCartItems ? "event-button active-cart" : "event-button"}
      onClick={addToCartHandler}
    >
      장바구니 {isCartItems ? "빼기" : "담기"}
    </button>
  );
}
