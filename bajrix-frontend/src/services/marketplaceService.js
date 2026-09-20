const BASE_URL ='http://localhost:8085';

export const fetchProducts = async (page = 0, size = 10) => {
    try {
        const response = await fetch(`${BASE_URL}/api/products?page=${page}&size=${size}`);
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        
       
        return {
            content: data.content || data, 
            isLastPage: data.last !== undefined ? data.last : true 
        }; 
    } catch (error) {
        console.error("Error fetching products:", error);
        return { content: [], isLastPage: true };
    }
};

export const fetchProductSellers = async (productId) => {
    try {
        const response = await fetch(`${BASE_URL}/api/products/${productId}`);
        if (!response.ok) throw new Error("Failed to fetch product sellers");
       const dto = await response.json();
        return dto.sellers || [];
    } catch (error) {
        console.error("Error fetching sellers for product:", error);
        return [];
    }
};

export const loginSeller = async (username, password) => {
   //hardcoded for now 
    if (username === "admin" && password === "password") {
        return { success: true, sellerId: "10000000-0000-0000-0000-000000000001" };
    }
    return { success: false };
};

export const fetchSellerDashboardListings = async (sellerId) => {
    try {
        const response = await fetch(`${BASE_URL}/api/sellerlistings/${sellerId}`);
        if (!response.ok) throw new Error("Failed to fetch dashboard listings");
        return await response.json();
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        return [];
    }
};

export const updateSellerListing = async (listingId, sellerId, price, availableStock) => {
    try {
        const response = await fetch(`${BASE_URL}/api/listings/${listingId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Seller-Id': sellerId
            },
            body: JSON.stringify({ 
                price: parseFloat(price), 
                availableStock: parseInt(availableStock, 10) 
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Failed to update listing");
        }
        
        return { success: true };
    } catch (error) {
        console.error("Error updating listing:", error);
        return { success: false, error: error.message };
    }
};