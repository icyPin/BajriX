import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import SellerLoginPage from './pages/SellerLoginPage';
import SellerDashboardPage from './pages/SellerDashboardPage';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/product/:id" element={<ProductDetailsPage />} />
                <Route path="/seller/login" element={<SellerLoginPage />} />
                <Route path="/seller/dashboard" element={<SellerDashboardPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;