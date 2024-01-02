import { useRef, useContext } from 'react';
import CartModal from './CartModal.jsx';
import { CartContext } from '../store/shopping-cart-context.jsx';
import {loadStripe} from '@stripe/stripe-js';


export default function Header() {
  const modal = useRef();
  const {items} = useContext(CartContext)

  
  const cartQuantity = items.length;

  const makePayment = async() => {
    const stripe = await loadStripe("pk_test_51NV5bPSFiYAHU0GmE75rhFrHfw9eLC22r9AEIvAUBAq4jPNUZd72e1HbtwAy239KNAlcgFOIwJDgjFF3XoSPBiFW00VPdmGdjB");

    const body = {
      // products: cartQuantity,
      // totalPrice : items.reduce((acc,curr)=> acc+= curr.price * curr.quantity ,0)

      products: items
    }
console.log(body,"body");
    const headers = {
      "Content-Type": "application/json"
    }

    const response = await fetch("http://localhost:7000/api/create-checkout-session",{
      method:"POST",
      headers:headers,
      body:JSON.stringify(body)
    }
    )

    const session = await response.json();

    const result = stripe.redirectToCheckout({
      sessionId:session.id
    })

    console.log(result, "result");
  }

  function handleOpenCartClick() {
    modal.current.open();
  }

  let modalActions = <button>Close</button>;


  if (cartQuantity > 0) {
    modalActions = (
      <>
        <button>Close</button>
        <button onClick={makePayment}>Checkout</button>
      </>
    );
  }

  return (
    <>
      <CartModal
        ref={modal}
       
        title="Your Cart"
        actions={modalActions}
      />
      <header id="main-header">
        <div id="main-title">
          <img src="logo.png" alt="Elegant model" />
          <h1>Elegant Context</h1>
        </div>
        <p>
          <button onClick={handleOpenCartClick}>Cart ({cartQuantity})</button>
        </p>
      </header>
    </>
  );
}
