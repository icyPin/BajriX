package com.example.BajriX.repository;

import com.example.BajriX.model.SellerListing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.*;

public interface SellerListingRepository extends JpaRepository<SellerListing , UUID> {

    // For the buyer: Fetching all active listings for a specific product
    @Query("SELECT sl FROM SellerListing sl WHERE sl.product.id = :productId AND sl.isActive = true AND sl.seller.status = com.example.BajriX.model.SellerStatus.APPROVED")
    List<SellerListing> findActiveListingsForProduct(@Param("productId") UUID productId);

    // For the seller: Fetching all listings belonging to a specific seller
    List<SellerListing> findBySellerId(UUID sellerId);

    // To check for duplicates or fetch a specific listing for updates
    Optional<SellerListing> findByProductIdAndSellerId(UUID productId, UUID sellerId);
}
