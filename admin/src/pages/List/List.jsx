
import React, { useEffect, useState } from 'react';
import './List.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const List = ({ url }) => {
  const [list, setList] = useState([]);

  // FETCH FOOD LIST FROM SUPABASE
  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);

      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error('Unable to fetch food items');
      }
    } catch (error) {
      console.error('Fetch food error:', error.message);
      toast.error('Error loading food list');
    }
  };

  // REMOVE FOOD ITEM
  const removeFood = async (foodId) => {
    try {
      const response = await axios.post(
        `${url}/api/food/remove`,
        { id: foodId }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message || 'Unable to remove food');
      }
    } catch (error) {
      console.error('Remove food error:', error.message);
      toast.error(
        error.response?.data?.message || 'Error removing food'
      );
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="list add flex-col">
      <p>All Foods List</p>

      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>

        {list.map((item) => (
          <div key={item.id} className="list-table-format">
            <img src={item.image} alt={item.name} />

            <p>{item.name}</p>
            <p>{item.category}</p>

            <p>
              {new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR'
              }).format(Number(item.price))}
            </p>

            <p
              onClick={() => removeFood(item.id)}
              className="cursor"
            >
              X
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;
