import { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProductTable from './ProductTable';
import AddProduct from './AddProduct';
import EditProduct from './EditProduct';

export default function App() {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/data');
      setData(response.data);
    } catch (error) {
      console.error('There was an error fetching the data!', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/deleteProduct/${id}`)
      fetchData(); // Refresh the product list

    } catch (error) {
      console.error('There was an error deleting the product!', error);
    };
  };

  return (
    <Router>

      <div className="App">
        <a href="/"><h1>Products</h1></a>
        <Routes>
          <Route path="/" element={<ProductTable data={data} onEdit={() => fetchProducts()} onDelete={handleDelete} />} />
          <Route path="/addProducts" element={<AddProduct />} />
          <Route path="/editProducts/:id" element={<EditProduct />} />
        </Routes>
      </div>
    </Router>
  );
}
