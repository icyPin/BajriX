import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
    const navigate = useNavigate();
    const [searchInput, setSearchInput] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/?query=${searchInput}`);
    };

    return (
        <nav className="navbar">
            <div className="logo" onClick={() => navigate('/')}>
                <h2>BajriX</h2>
            </div>
            <form className="search-container" onSubmit={handleSearch}>
                <input 
                    type="text" 
                    placeholder="Search products..." 
                    className="search-bar" 
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                />
                <button type="submit" style={{ backgroundColor: '#0056b3', color: 'white' }}>Search</button>
                <button type="button" onClick={() => navigate('/seller/login')} style={{ marginLeft: '1rem', backgroundColor: '#28a745', color: 'white' }}>
                     seller ???
                </button>
            </form>
        </nav>
    );
}