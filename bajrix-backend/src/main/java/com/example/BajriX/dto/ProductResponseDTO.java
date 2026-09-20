package com.example.BajriX.dto;

import java.util.List;
import java.util.UUID;

public record ProductResponseDTO(
        UUID id,
        String name,
        String description,
        List<SellerListingDTO> sellers
){}
