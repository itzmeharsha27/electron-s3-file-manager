import { useState, useEffect, useContext } from 'react';
import axios from '../utils/axios';
import AuthContext from '../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';

const EditProduct = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({ name: '', price: '', description: '' });

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await axios.get(`/products`);
      const p = res.data.find((p) => p._id === id);
      setProduct(p);
    };
    fetchProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/products/${id}`, product, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Product updated');
      navigate('/products');
    } catch (err) {
      console.log(err);
    }
  };

  if (!user || user.role !== 'admin') return <p>No permission</p>;

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={product.name} onChange={(e) => setProduct({ ...product, name: e.target.value })} required />
      <input type="number" value={product.price} onChange={(e) => setProduct({ ...product, price: e.target.value })} required />
      <input type="text" value={product.description} onChange={(e) => setProduct({ ...product, description: e.target.value })} required />
      <button type="submit">Update Product</button>
    </form>
  );
};

export default EditProduct;
