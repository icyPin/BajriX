package com.example.BajriX.service;


import com.example.BajriX.dto.ProductResponseDTO;
import com.example.BajriX.dto.ProductsDTO;
import com.example.BajriX.dto.SellerListingDTO;
import com.example.BajriX.dto.SellerListingsResponseDTO;
import com.example.BajriX.model.Product;
import com.example.BajriX.model.SellerListing;
import com.example.BajriX.repository.ProductRepository;
import com.example.BajriX.repository.SellerListingRepository;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class MarketplaceService {

    private final ProductRepository productRepository;
    private final SellerListingRepository sellerListingRepository;

    public MarketplaceService(ProductRepository productRepository , SellerListingRepository sellerListingRepository){
        this.productRepository=productRepository;
        this.sellerListingRepository=sellerListingRepository;
    }

    public ProductResponseDTO getProductDetails(UUID productID){
        Product product = productRepository.findById(productID)
                .orElseThrow(()-> new RuntimeException("Product not found"));

        List<SellerListing> listings = sellerListingRepository.findActiveListingsForProduct(productID);

        List<SellerListingDTO> listingDTOS = listings.stream()
                .map(listing -> new SellerListingDTO(
                        listing.getId(),
                        listing.getSeller().getId(),
                        listing.getSeller().getName(),
                        listing.getPrice(),
                        listing.getAvailableStock(),
                        listing.getMinOrderQuantity()
                ))
                .collect(Collectors.toList());

        return new ProductResponseDTO(
                product.getId(),
                product.getName(),
                product.getDescription(),
                listingDTOS
        );

    }

    @Transactional
    public SellerListing updateListing(UUID listingId, UUID requesterSellerId, BigDecimal newPrice, Integer newStock) {
        SellerListing listing = sellerListingRepository.findById(listingId)
                .orElseThrow(() -> new RuntimeException("Listing not found"));

        if (!listing.getSeller().getId().equals(requesterSellerId)) {
            throw new RuntimeException("Seller is is not yours");
        }

        if (newPrice != null) listing.setPrice(newPrice);
        if (newStock != null) listing.setAvailableStock(newStock);

        return sellerListingRepository.save(listing);
    }

    public Page<ProductsDTO> getAllProducts(String search, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Product> productPage;

        if (search != null && !search.trim().isEmpty()) {
            productPage = productRepository.findByNameContainingIgnoreCase(search.trim(), pageable);
        } else {
            productPage = productRepository.findAll(pageable);
        }
        return productPage.map(p -> new ProductsDTO(p.getId(), p.getName(), p.getDescription()));
    }

    public List<SellerListingsResponseDTO> getSellerListings(UUID sellerId){
        return sellerListingRepository.findBySellerId(sellerId)
                .stream()
                .map(listing -> new SellerListingsResponseDTO(
                        listing.getId(),
                        listing.getProduct().getName(),
                        listing.getPrice(),
                        listing.getAvailableStock(),
                        listing.getIsActive()
                ))
                .collect(Collectors.toList());
    }
}
