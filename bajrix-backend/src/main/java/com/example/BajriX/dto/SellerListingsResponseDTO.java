package com.example.BajriX.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record SellerListingsResponseDTO(
        UUID listingId,
        String productName,
        BigDecimal price,
        Integer availableStock,
        Boolean isActive
)
{}
