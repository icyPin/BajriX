package com.example.BajriX.controller;

import com.example.BajriX.dto.ListingUpdateRequest;
import com.example.BajriX.model.Product;
import com.example.BajriX.model.Seller;
import com.example.BajriX.model.SellerListing;
import com.example.BajriX.model.SellerStatus;
import com.example.BajriX.repository.ProductRepository;
import com.example.BajriX.repository.SellerListingRepository;
import com.example.BajriX.repository.SellerRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.databind.ObjectMapper;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.math.BigDecimal;
import java.util.UUID;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import static org.junit.jupiter.api.Assertions.assertThrows;
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class MarketplaceIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private SellerRepository sellerRepository;

    @Autowired
    private SellerListingRepository sellerListingRepository;

    @Autowired
    private org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    private UUID testProductId;
    private UUID authorizedSellerId;
    private UUID unauthorizedSellerId;
    private UUID listingId;

    @BeforeEach
    void setUp() {

        //mock data for testing

        Product product = new Product();
        product.setName("UltraTech PPC Cement 50 kg");
        product.setDescription("Premium Portland Pozzolana Cement for high strength construction.");
        product = productRepository.save(product);
        testProductId = product.getId();

        Seller authorizedSeller = new Seller();
        authorizedSeller.setName("Shree Traders");
        authorizedSeller.setStatus(SellerStatus.APPROVED);
        authorizedSeller = sellerRepository.save(authorizedSeller);
        authorizedSellerId = authorizedSeller.getId();

        Seller unauthorizedSeller = new Seller();
        unauthorizedSeller.setName("BuildMart Connect");
        unauthorizedSeller.setStatus(SellerStatus.APPROVED);
        unauthorizedSeller = sellerRepository.save(unauthorizedSeller);
        unauthorizedSellerId = unauthorizedSeller.getId();

        SellerListing listing = new SellerListing();
        listing.setProduct(product);
        listing.setSeller(authorizedSeller);
        listing.setPrice(new BigDecimal("390.00"));
        listing.setAvailableStock(500);
        listing.setMinOrderQuantity(50);
        listing.setIsActive(true);
        listing = sellerListingRepository.save(listing);
        listingId = listing.getId();
    }

    // this test shows the product list of first page (20 products) is returned
    @Test
    void shouldReturnProductsList() throws Exception {

        mockMvc.perform(get("/api/products")
                        .param("page", "0")
                        .param("size", "10")
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());
    }

    //test when product not found should return 404
    @Test
    void ProductNotFound() throws Exception {
        mockMvc.perform(get("/api/products/" + UUID.randomUUID())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    // check if it retursn seller dashboard listing
    @Test
    void shouldReturnSellerDashboardInventory() throws Exception {
        mockMvc.perform(get("/api/sellerlistings/" + authorizedSellerId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].productName").value("UltraTech PPC Cement 50 kg"))
                .andExpect(jsonPath("$[0].price").value(390.00));
    }

    // this shows the seller who owns the list can modify
    @Test
    void shouldAllowUpdateWhenAuthorized() throws Exception {
        ListingUpdateRequest request = new ListingUpdateRequest(new BigDecimal("310.00"), 45);

        mockMvc.perform(put("/api/listings/" + listingId)
                        .header("X-Seller-Id", authorizedSellerId.toString())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().string("Listing updated successfully."));
    }

    //here the listId of authorise seller is passed along eith the authorise one  to prove that he cant
    //modify that list
    @Test
    void shouldRejectUpdateWhenUnauthorized() throws Exception {

        ListingUpdateRequest request = new ListingUpdateRequest(new BigDecimal("50.00"), 0);
        mockMvc.perform(put("/api/listings/" + listingId)
                        .header("X-Seller-Id", unauthorizedSellerId.toString())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Seller is is not yours"));
    }

    @Test
    void testOnConcurrentUpdate() {
        //both seller A & B both load the exact same listing at the same time (Version 0)
        SellerListing AView = sellerListingRepository.findById(listingId).get();
        SellerListing BView = sellerListingRepository.findById(listingId).get();

        //A makes the changes -->> version gets updated. i have simulated this here manually
        //bcs hibernate caching was not creating new object for b and reassigning a's it should work outside the
        //test environment though
        AView.setPrice(new BigDecimal("400.00"));
        sellerListingRepository.saveAndFlush(AView);
        jdbcTemplate.update("UPDATE seller_listings SET version = version + 1 WHERE id = ?", listingId);

        //B tries to update the stock, fails bcs it still have version 0
        BView.setAvailableStock(10);

        // should pass now
        assertThrows(ObjectOptimisticLockingFailureException.class, () -> {
            sellerListingRepository.saveAndFlush(BView);
        });
    }
}
