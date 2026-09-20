import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { fetchSellerDashboardListings, updateSellerListing } from '../services/marketplaceService';

export default function SellerDashboardPage() {
    const [listings, setListings] = useState([]);
    const [editingListing, setEditingListing] = useState(null); // Holds the listing being edited
    const [editPrice, setEditPrice] = useState('');
    const [editStock, setEditStock] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    
    const navigate = useNavigate();
    const sellerId = localStorage.getItem('bajrix_seller_id');

    const loadInventory = useCallback(() => {
        if (sellerId) {
            fetchSellerDashboardListings(sellerId).then(data => setListings(data));
        }
    }, [sellerId]);

    useEffect(() => {
        if (!sellerId) {
            navigate('/seller/login');
            return;
        }
        loadInventory();
    }, [sellerId, navigate, loadInventory]);

    const handleLogout = () => {
        localStorage.removeItem('bajrix_seller_id');
        navigate('/');
    };

    const openEditModal = (listing) => {
        setEditingListing(listing);
        setEditPrice(listing.price);
        setEditStock(listing.availableStock);
        setErrorMsg('');
    };

    const closeEditModal = () => {
        setEditingListing(null);
        setErrorMsg('');
    };

    const submitUpdate = async (e) => {
        e.preventDefault();
        const response = await updateSellerListing(editingListing.listingId, sellerId, editPrice, editStock);
        
        if (response.success) {
            closeEditModal();
            loadInventory(); // Refresh the list to show new values
        } else {
            setErrorMsg(response.error || "Something went wrong.");
        }
    };

    return (
        <div className="page-container">
            <Navbar />
            <main className="content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h2>My Inventory</h2>
                    <button onClick={handleLogout} style={{ backgroundColor: '#dc3545', color: 'white' }}>Logout</button>
                </div>
                
                <div className="seller-list">
                    {listings.map(listing => (
                        <div 
                            key={listing.listingId} 
                            className="card list-card" 
                            onClick={() => openEditModal(listing)}
                            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', borderLeft: '4px solid #0056b3' }}
                            title="Click to edit listing"
                        >
                            <div>
                                <h4>{listing.productName}</h4>
                                <p style={{ color: listing.isActive ? 'green' : 'red', fontSize: '0.9rem', marginTop: '4px' }}>
                                    {listing.isActive ? '● Active' : '○ Inactive'}
                                </p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p><strong>Price:</strong> ₹{listing.price}</p>
                                <p><strong>Stock:</strong> {listing.availableStock} units</p>
                                <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '4px' }}>Click to edit</p>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {/* EDIT MODAL OVERLAY */}
            {editingListing && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <h3>Edit Listing</h3>
                        <p style={{ marginBottom: '1rem', color: '#555' }}>{editingListing.productName}</p>
                        
                        <form onSubmit={submitUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '4px' }}>Price (₹)</label>
                                <input 
                                    type="number" 
                                    step="0.01"
                                    value={editPrice} 
                                    onChange={(e) => setEditPrice(e.target.value)} 
                                    className="search-bar" 
                                    style={{ width: '100%' }}
                                    required
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '4px' }}>Available Stock</label>
                                <input 
                                    type="number" 
                                    value={editStock} 
                                    onChange={(e) => setEditStock(e.target.value)} 
                                    className="search-bar" 
                                    style={{ width: '100%' }}
                                    required
                                />
                            </div>
                            
                            {errorMsg && <p style={{ color: 'red', fontSize: '0.9rem', margin: 0 }}>{errorMsg}</p>}
                            
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" onClick={closeEditModal} style={{ backgroundColor: '#e2e3e5', color: '#333' }}>
                                    Cancel
                                </button>
                                <button type="submit" style={{ backgroundColor: '#28a745', color: 'white' }}>
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

// Simple inline styles for the modal so you don't have to write more CSS
const modalOverlayStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    zIndex: 1000
};

const modalContentStyle = {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '12px',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
};