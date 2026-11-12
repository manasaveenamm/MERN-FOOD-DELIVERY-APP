
import React, { useState, useEffect } from 'react';
import './Orders.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(url + '/api/order/list');

      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        toast.error('Error fetching orders');
      }
    } catch (error) {
      toast.error('Could not fetch orders');
      console.error(error);
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(url + '/api/order/status', {
        orderId,
        status: event.target.value
      });

      if (response.data.success) {
        await fetchAllOrders();
        toast.success('Order status updated');
      } else {
        toast.error('Could not update order status');
      }
    } catch (error) {
      toast.error('Could not update order status');
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className="order add">
      <h3>Order Page</h3>

      <div className="order-list">
        {orders.map((order, index) => (
          <div key={order._id || index} className="order-item">
            <span role="img" aria-label="Package">📦</span>

            <div>
              <p className="order-item-food">
                {order.items.map((item, itemIndex) => (
                  <span key={itemIndex}>
                    {item.name} x {item.quantity}
                    {itemIndex !== order.items.length - 1 ? ' , ' : ''}
                  </span>
                ))}
              </p>

              <p className="order-item-name">
                {order.address.firstName} {order.address.lastName}
              </p>

              <div className="order-item-address">
                <p>{order.address.state},</p>
                <p>
                  {order.address.city}, {order.address.state},{' '}
                  {order.address.country}, {order.address.zipcode}
                </p>
              </div>

              <p className="order-item-phone">
                {order.address.phone}
              </p>
            </div>

            <p>Items: {order.items.length}</p>
            <p>₹{order.amount}</p>

            <select
              onChange={(event) => statusHandler(event, order._id)}
              value={order.status}
            >
              <option value="Food Processing">Food Processing</option>
              <option value="Out for delivery">Out for delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
