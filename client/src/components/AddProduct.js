import { useState, useContext } from 'react';
import axios from '../utils/axios';
import AuthContext from '../context/AuthContext';

const AddProduct = () => {
  const { user } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('/products', { name, price, description }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Product added');
      setName(''); setPrice(''); setDescription('');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      {user && user.role === 'admin' ? (
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required />
          <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
          <button type="submit">Add Product</button>
        </form>
      ) : <p>You do not have permission to view this page.</p>}
    </div>
  );
};

export default AddProduct;
