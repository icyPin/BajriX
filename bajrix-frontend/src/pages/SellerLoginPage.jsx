import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { loginSeller } from '../services/marketplaceService';

export default function SellerLoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const response = await loginSeller(username, password);
        
        if (response.success) {
            localStorage.setItem('bajrix_seller_id', response.sellerId);
            navigate('/seller/dashboard');
        } else {
            setError('Invalid credentials. Try admin / password');
        }
    };

    return (
        <div className="page-container">
            <Navbar />
            <main className="content" style={{ maxWidth: '400px', marginTop: '4rem' }}>
                <h2>Seller Portal</h2>
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                    <input 
                        type="text" 
                        placeholder="Username" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        className="search-bar" 
                        style={{ width: '100%' }}
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        className="search-bar" 
                        style={{ width: '100%' }}
                    />
                    {error && <p style={{ color: 'red', fontSize: '0.9rem' }}>{error}</p>}
                    <button type="submit" style={{ padding: '0.5rem', backgroundColor: '#0056b3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        Login
                    </button>
                </form>
            </main>
        </div>
    );
}