package com.example.BajriX.dto;

import java.math.BigDecimal;

public record ListingUpdateRequest(
        BigDecimal price,
        Integer availableStock
) {}
