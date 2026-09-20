# BajriX -  Marketplace

BajriX is a full-stack marketplace application connecting buyers with multiple sellers . It features a universal product catalog, a dedicated seller dashboard for real-time inventory and price management.

---

## Table of Contents

1. [How to Run the Application](#1-how-to-run-the-application)
2. [Important Architectural Decisions](#2-important-architectural-decisions)
3. [Assumptions Made](#3-assumptions-made)
4. [Intentionally Omitted Features](#4-intentionally-omitted-features)
5. [What I Would Improve With More Time](#5-what-i-would-improve-with-more-time)
6. [Considerations for Millions of Products/Listings](#6-considerations-for-millions-of-productslistings)

---

## 1. How to Run the Application

### Prerequisites

- Java 21
- Node.js (v18+)
- Docker & Docker Compose (recommended for the database) **OR** local PostgreSQL 18

here use of docker is strictly recommended to avaoid application.yml configuration to match your local data base 

### Step 1: Start the Database (Docker Method)

Run the included Docker Compose file from the root directory:

```bash
docker compose up -d
```

> **Note:** This exposes PostgreSQL on port `5432`(if the port is not free in your pc make sure to free it) with the credentials configured in `application.yml`. Flyway will automatically create the schema and seed the database with 20 records on application startup.

### Step 2: Start the Spring Boot Backend

Navigate to the backend directory and run the application using Maven:

```bash
cd bajrix-backend
./mvnw spring-boot:run
```

The backend REST API will start on **http://localhost:8085**.

### Step 3: Start the React Frontend

Open a new terminal, navigate to the frontend directory, install dependencies, and start the Vite development server:

```bash
cd bajrix-frontend
npm install
npm run dev
```

The frontend UI will be accessible at **http://localhost:5173**.

> A slight uncalled for note. this is the ui i am not particularly proud of but due to severe time constarins and focus on polishing the backend i made one that was serviceable.

> To view the seller dashboard, click **"I am a seller"** and use the mock credentials: `admin` / `password`.


> I have included a list of pre configured test of the api u can run them directly the file from the intellij idea bajrix-backend/src/test/java/com/example/BajriX/controller/MarketplaceIntegrationTest.java. Or simply from the terminal 

### Running the Tests
The backend includes integration tests to verify the REST API, database constraints, and optimistic locking logic. Ensure the Docker database is running (`docker compose up -d`), then execute:

```bash
cd bajrix-backend
./mvnw test
```

## 2. Important Architectural Decisions

- **Universal Product Catalog (Bridge Table Pattern):** Instead of sellers creating redundant products, the database uses a centralized `products` table. The `seller_listings` table acts as a bridge, mapping sellers to products with specific prices and stock levels.

- **Optimistic Locking for Inventory:** The `seller_listings` table implements an `@Version` column. If two sellers (or a seller and a buyer) attempt to update stock or pricing simultaneously, JPA throws an `ObjectOptimisticLockingFailureException`, preventing lost updates and race conditions.

- **DTO Projection Layer:** Entities are strictly confined to the persistence layer. Java Records (`ProductResponseDTO`, `SellerListingDTO`) are used to flatten nested Hibernate relationships, preventing circular JSON serialization and reducing payload size.

- **Database Migrations (Flyway):** Schema creation (`V2`) and data seeding (`V3`) are decoupled into separate Flyway scripts, ensuring predictable, version-controlled database initialization across environments.

- **Native React Modals & URL State:** Search parameters are tracked via URL query strings (`?query=cement`) rather than internal component state, allowing users to bookmark and share specific search results.

- **Code Readibility** The entire code base (both frontend and backend is written with scalibility and code maintanibility in mind. individual components can be scaled/altered and new features can be added later without breaking most of the code and folder structure ensures smooth navigation)

---

## 3. Assumptions Made

- **Authentication Scope:** For this MVP, a mock hardcoded login (`admin` / `password`) maps to a specific seeded seller UUID (`10000000-0000-0000-0000-000000000001`).

- **Currency and Localization:** Pricing is assumed to be in a single currency (INR ₹), and stock is tracked in generalized "units" rather than specific dimensional metrics (kg, tons, pallets).

- **Listing Uniqueness:** A seller can only have one active listing per unique product ID.

---

## 4. Intentionally Omitted Features

- **JWT / OAuth Authentication:** Real session management and hashed password storage were omitted to focus purely on core catalog and inventory mechanics.

- **Checkout & Payment Gateway:** The "Buy Now" flow is purely presentational. Shopping cart logic, transactional order creation, and payment integration were kept out of scope.

- **Image Hosting:** Product images were omitted to avoid introducing AWS S3 or complex multipart file handling into the API requirements.

- **Seller Registration Flow:** The system assumes sellers are pre-approved and vetted by administrators.

---

## 5. What I Would Improve With More Time

- **CI/CD Pipeline:** Implement GitHub Actions to run the existing JUnit integration tests and build the Vite bundle automatically on push using jenkins or something.

- **Global Error Handling:** Implement a robust `@ControllerAdvice` layer in Spring Boot to map all custom exceptions (like `ProductNotFoundException` or locking failures) to standardized RFC 7807 problem detail JSON responses.

- **Comprehensive Frontend Testing:** Add Jest and React Testing Library to verify component rendering, routing, and mock API integrations.

- **Audit Logging:** Track historical price changes for listings using Hibernate Envers to build price history graphs for buyers.

---

## 6. Considerations for Millions of Products/Listings

If this platform were to scale to millions of records, the current architecture would require the following evolutionary changes:

- **Caching Strategy (Redis):** The homepage and high-traffic `ProductDetailsPage` queries would be cached in Redis. Catalog data is highly read-heavy, so caching would drastically reduce database I/O.

- **CQRS Implementation:** I would separate the read model (browsing products) from the write model (updating inventory). Fast, denormalized read replicas would serve the frontend, while the primary database handles strictly ACID inventory writes.

- **Database Indexing:** Ensure B-Tree indexes are applied to the `seller_listings.product_id` and `seller_listings.seller_id` foreign keys to speed up the `JOIN` operations when aggregating product detail pages.