import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { fetchProductSellers } from '../services/marketplaceService';

export default function ProductDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate(); 
    const [sellers, setSellers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProductSellers(id).then(data => {
            if (Array.isArray(data)) {
                setSellers(data);
            } else {
                setSellers([]);
            }
            setLoading(false);
        });
    }, [id]);

    return (
        <div className="page-container">
            <Navbar />
            <main className="content">
                {/* BACK BUTTON */}
                <button 
                    onClick={() => navigate(-1)} 
                    style={{ marginBottom: '1.5rem', backgroundColor: '#6c757d', color: 'white' }}
                >
                    &larr; Back to Catalog
                </button>

                <h2>Sellers for this Product</h2>

                {loading ? (
                    <p>Loading sellers...</p>
                ) : sellers.length === 0 ? (
                    <p style={{ marginTop: '1rem', color: 'red' }}>No active sellers found for this product.</p>
                ) : (
                    <div className="seller-list">
                        {sellers.map(seller => (
                            <div key={seller.listingId} className="card list-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h4>{seller.sellerName}</h4>
                                    <p><strong>Price:</strong> ₹{seller.price}</p>
                                    <p><strong>Stock:</strong> {seller.availableStock} units</p>
                                    <p><strong>Min Order:</strong> {seller.minOrderQuantity} units</p>
                                </div>
                                <button style={{ backgroundColor: '#28a745', color: 'white' }}>
                                    Buy Now
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}