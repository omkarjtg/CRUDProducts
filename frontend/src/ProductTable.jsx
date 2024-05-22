import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'

export default function ProductTable({ data, onDelete }) {
  const [products, setProducts] = useState([]);
  const [flashMessage, setFlashMessage] = useState(null);

  useEffect(() => {

    const storedFlashMessage = localStorage.getItem('flashMessage');
    if (storedFlashMessage) {
      setFlashMessage(JSON.parse(storedFlashMessage));
      localStorage.removeItem('flashMessage');
    }
  }, []);


  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/data');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  return (
    <>
      <div>
        {flashMessage && (
          <div className={`alert ${flashMessage.type}`} role="alert">
            {flashMessage.message}
          </div>
        )}
        <Link to="/addProducts">
          <button
            type="button"
            style={{ marginLeft: '2em' }}
            className="btn btn-success btn-sm"
          >
            Add a product
          </button>
        </Link>
      </div>
      <table style={{ marginTop: '1em', marginLeft: '2em' }} className="table table-bordered">
        <thead>
          <tr>
            <th style={{ width: '10rem' }} className="table-info">Product ID</th>
            <th style={{ width: '10rem' }} className="table-info">Product Name</th>
            <th style={{ width: '10rem' }} className="table-info">Quantity</th>
            <th style={{ width: '10rem' }} className="table-info">Price</th>
            <th style={{ width: '10rem' }}></th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>{item.price}</td>
              <td style={{ border: 'none', padding: 0 }}>
                <Link to={`/editProducts/${item.id}`}>
                  <button className="btn btn-warning btn-sm" type="button">Edit</button>
                </Link>

                <button style={{ marginRight: '0.5em' }} className="btn btn-danger btn-sm" onClick={() => onDelete(item.id)}>Delete</button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
