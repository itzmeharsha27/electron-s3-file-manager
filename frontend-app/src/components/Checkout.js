import { useState, useEffect, useContext } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from '../utils/axios';
import AuthContext from '../context/AuthContext';

const stripePromise = loadStripe('YOUR_PUBLISHABLE_KEY');

const CheckoutForm = () => {
  const { user } = useContext(AuthContext);
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState('');
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const res = await axios.post('/payment/create-payment-intent', { amount });
        setClientSecret(res.data.clientSecret);
      } catch (err) {
        console.log(err);
      }
    };
    if (amount > 0) createPaymentIntent();
  }, [amount]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card },
    });

    if (error) console.log(error);
    else alert('Payment successful: ' + paymentIntent.id);
  };

  if (!user) return <p>Please login to pay.</p>;

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        placeholder="Amount in cents"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <CardElement />
      <button type="submit" disabled={!stripe || !clientSecret}>Pay</button>
    </form>
  );
};

const Checkout = () => (
  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>
);

export default Checkout;
