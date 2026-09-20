package com.example.BajriX.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record SellerListingDTO(
        UUID listingId,
        UUID sellerId,
        String sellerName,
        BigDecimal price,
        int availableStock,
        int minOrderQuantity
){}