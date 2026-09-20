import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import { fetchProducts } from '../services/marketplaceService';

export default function HomePage() {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [isLastPage, setIsLastPage] = useState(true);
    
    const [searchParams] = useSearchParams();
    const query = searchParams.get('query') || '';

    useEffect(() => {
        fetchProducts(currentPage, 10).then(data => {
            let fetchedProducts = data.content;
            
            if (query) {
                fetchedProducts = fetchedProducts.filter(product => 
                    product.name.toLowerCase().includes(query.toLowerCase()) ||
                    product.description.toLowerCase().includes(query.toLowerCase())
                );
            }
            
            setProducts(fetchedProducts);
            setIsLastPage(data.isLastPage);
        });
    }, [query, currentPage]); 

    return (
        <div className="page-container">
            <Navbar />
            <main className="content">
                {products.length === 0 ? (
                    <p>No products found for "{query}"</p>
                ) : (
                    <>
                        <div className="card-grid">
                            {products.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        {/* PAGINATION CONTROLS */}
                        {!query && ( 
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.5rem', marginTop: '3rem', paddingBottom: '2rem' }}>
                                <button 
                                    onClick={() => setCurrentPage(prev => prev - 1)} 
                                    disabled={currentPage === 0}
                                    style={{ backgroundColor: currentPage === 0 ? '#e9ecef' : '#0056b3', color: currentPage === 0 ? '#6c757d' : 'white' }}
                                >
                                    &larr; Previous
                                </button>
                                
                                <span style={{ fontWeight: '500' }}>Page {currentPage + 1}</span>
                                
                                <button 
                                    onClick={() => setCurrentPage(prev => prev + 1)} 
                                    disabled={isLastPage}
                                    style={{ backgroundColor: isLastPage ? '#e9ecef' : '#0056b3', color: isLastPage ? '#6c757d' : 'white' }}
                                >
                                    Next &rarr;
                                </button>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}