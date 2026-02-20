import React, { useContext } from 'react'
import './Cart.css'
import { StoreContext } from '../../components/context/StoreContext'
import { useNavigate } from 'react-router-dom'

const Cart = () => {

  const { cartItems, food_list, removeFromCart, getTotalCartAmount } =
    useContext(StoreContext)

  const navigate = useNavigate()

  // USD → INR conversion (×10)
  const toINR = (amount) => `₹${amount * 10}`

  return (
    <div className='cart'>
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>

        <br />
        <hr />

        {food_list.map((item, index) => {
          if (cartItems[item._id] > 0) {
            return (
              <div key={item._id}>
                <div className="cart-items-title cart-items-item">
                  <img src={item.image} alt={item.name} />
                  <p>{item.name}</p>
                  <p>{toINR(item.price)}</p>
                  <p>{cartItems[item._id]}</p>
                  <p>{toINR(item.price * cartItems[item._id])}</p>
                  <p
                    onClick={() => removeFromCart(item._id)}
                    className='cross'
                  >
                    x
                  </p>
                </div>
                <hr />
              </div>
            )
          }
          return null
        })}
      </div>

      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Total</h2>

          <div>
            <div className="cart-total-detail">
              <p>Subtotal</p>
              <p>{toINR(getTotalCartAmount())}</p>
            </div>

            <hr />

            <div className="cart-total-detail">
              <p>Delivery Fee</p>
              <p>{toINR(getTotalCartAmount() === 0 ? 0 : 2)}</p>
            </div>

            <hr />

            <div className="cart-total-detail">
              <b>Total</b>
              <b>
                {toINR(
                  getTotalCartAmount() === 0
                    ? 0
                    : getTotalCartAmount() + 2
                )}
              </b>
            </div>
          </div>

          <button onClick={() => navigate('/order')}>
            PROCEED TO CHECKOUT
          </button>
        </div>

        <div className="cart-promocode">
          <div>
            <p>If you have a promo code, enter it here</p>
            <div className='cart-promocode-input'>
              <input type="text" placeholder='Promo Code' />
              <button>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
