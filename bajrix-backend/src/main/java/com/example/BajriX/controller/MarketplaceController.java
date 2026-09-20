package com.example.BajriX.controller;


import com.example.BajriX.dto.ListingUpdateRequest;
import com.example.BajriX.dto.ProductResponseDTO;
import com.example.BajriX.model.SellerListing;
import com.example.BajriX.service.MarketplaceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class MarketplaceController {

    private final MarketplaceService marketplaceService;


    public MarketplaceController(MarketplaceService marketplaceService) {
        this.marketplaceService = marketplaceService;
    }

    @GetMapping("/products")
    public ResponseEntity<?> getAllProducts(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        return ResponseEntity.ok(marketplaceService.getAllProducts(search, page, size));
    }

    @GetMapping("/products/{productId}")
    public ResponseEntity<ProductResponseDTO> getProductDetails(@PathVariable UUID productId) {
        try {
            ProductResponseDTO response = marketplaceService.getProductDetails(productId);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/listings/{listingId}")
    public ResponseEntity<?> updateListing(
            @PathVariable UUID listingId,
            @RequestHeader("X-Seller-Id") UUID sellerId,
            @RequestBody ListingUpdateRequest request) {
        try {
            marketplaceService.updateListing(listingId, sellerId, request.price(), request.availableStock());
            return ResponseEntity.ok().body("Listing updated successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/sellerlistings/{sellerId}")
    public ResponseEntity<?> getSellerListings(@PathVariable UUID sellerId){
        try{
            return ResponseEntity.ok(marketplaceService.getSellerListings(sellerId));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
