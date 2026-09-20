package com.example.BajriX.repository;

import com.example.BajriX.model.Seller;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;

public interface SellerRepository extends JpaRepository<Seller , UUID> {
}
