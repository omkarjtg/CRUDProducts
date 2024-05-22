import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function EditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState({ name: '', quantity: '', price: '' });
    const [flashMessage, setFlashMessage] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get(`http://localhost:5000/api/data/${id}`);
            setProduct(response.data);
          } catch (error) {
            console.error('There was an error fetching the product!', error);
          }
        };
      
        // Call fetchData only if id has changed
        if (id) {
          fetchData();
        }
      }, [id]);
      

    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
      
        try {
          const response = await axios.put(`http://localhost:5000/editProduct/${id}`, product);
          console.log('Product updated successfully', response.data);
      
          localStorage.setItem('flashMessage', JSON.stringify({ message: 'Product updated successfully', type: 'alert-success' }));
      
          setProduct(response.data);
          navigate('/');
        } catch (error) {
          console.error('There was an error updating the product!', error);
          setFlashMessage({ message: 'Error updating product', type: 'alert-danger' });
        }
      };
      
    


    return (
        <div className="mb-3">
            {flashMessage && (
                <div className={`alert ${flashMessage.type}`} role="alert">
                    {flashMessage.message}
                </div>
            )}

            <h2>Edit Product</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label className="form-label">Name:</label>
                    <input
                        className="form-row"
                        type="text"
                        name="name"
                        value={product.name}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label className="form-label">Quantity:</label>
                    <input
                        className="form-row"
                        type="number"
                        name="quantity"
                        value={product.quantity}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label className="form-label">Price:</label>
                    <input
                        className="form-row"
                        type="number"
                        name="price"
                        value={product.price}
                        onChange={handleChange}
                    />
                </div>
                <button className='btn btn-warning btn-sm' type="submit">Update Product</button>
                <a href="/"> <button className='btn btn-secondary btn-sm'>Cancel</button></a>
            </form>
        </div>
    );
}
