import React, { useState } from 'react';

function Cart() {

  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Product Name 1', description: 'Description of the product.', price: 49.99, quantity: 1, image: 'product-image-1.png' },
    { id: 2, name: 'Product Name 2', description: 'Description of the product.', price: 29.99, quantity: 2, image: 'product-image-2.png' },
  ]);

 
  const increaseQuantity = (id: number) => {
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };


  const decreaseQuantity = (id: number) => {
    setCartItems(cartItems.map(item => 
      item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    ));
  };


  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.075; 
  const total = subtotal + tax;

  return (
    <div className="m-auto w-full max-w-[1120px] p-3">

      <div className="flex pt-3 justify-between pb-10 flex-col sm:flex-row items-center">
        <div className="flex items-center gap-4">
          <img src="logo.png" alt="Logo" className="w-10 h-10" />
          <span className="text-2xl font-bold">NC</span>
        </div>
        <div className="flex gap-4 mt-4 sm:mt-0">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">Profile</button>
          <button className="bg-red-500 text-white px-4 py-2 rounded-lg">Logout</button>
        </div>
      </div>


      <h2 className="text-center font-bold text-[32px] lg:text-[48px] pt-8">Shopping Cart</h2>
      

      <div className="flex flex-col gap-8 py-8">
        {cartItems.map((item) => (
          <div key={item.id} className="flex flex-col sm:flex-row items-center bg-gray-100 p-4 rounded-lg shadow-md">
            <img src={item.image} alt={item.name} className="w-32 h-32 rounded-lg" />
            <div className="sm:ml-8 flex flex-col w-full sm:w-auto text-center sm:text-left">
              <h3 className="font-semibold text-[20px]">{item.name}</h3>
              <p className="text-[16px] text-gray-500">{item.description}</p>
              <div className="flex items-center gap-2 mt-4">
                <span className="text-[18px] font-bold">${item.price.toFixed(2)}</span>
                <div className="flex items-center gap-2 ml-auto">
                  <button 
                    onClick={() => decreaseQuantity(item.id)} 
                    className="bg-gray-300 w-8 h-8 flex justify-center items-center rounded-full"
                  >
                    -
                  </button>
                  <span className="text-[18px]">{item.quantity}</span>
                  <button 
                    onClick={() => increaseQuantity(item.id)} 
                    className="bg-gray-300 w-8 h-8 flex justify-center items-center rounded-full"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>


      <div className="bg-[#9900FF] h-auto lg:h-[200px] rounded-[30px] mt-10 p-8 text-white">
        <h3 className="text-[24px] font-semibold">Order Summary</h3>
        <div className="flex justify-between pt-4">
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between pt-2">
          <span>Tax:</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold pt-2 text-[20px]">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <button className="bg-white text-[#9900FF] mt-6 w-full py-2 rounded-lg font-bold hover:bg-gray-200 transition-colors">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}

export default Cart;