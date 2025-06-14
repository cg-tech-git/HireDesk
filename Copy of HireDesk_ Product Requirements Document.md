## **Product Requirements Document (PRD): HireDesk**

**Version:** 1.0 

**Status:** Draft 

**Date:** June 14, 2025

---

### **1\. Introduction**

#### **1.1. Problem**

Businesses and individuals seeking to rent equipment face a fragmented, inefficient, and opaque process. Current methods often rely on phone calls, emails, and manual spreadsheet calculations, leading to significant delays in receiving quotes. This manual process is prone to human error, resulting in inconsistent pricing, and lacks a centralized system for tracking and managing rental requests. Customers lack the ability to self-serve and instantly understand costs for specific timeframes, creating a poor user experience and a high-touch, costly sales cycle for the rental business.

#### **1.2. Vision**

To create the industry-leading digital platform for equipment rental, transforming the current manual process into a seamless, self-service experience. HireDesk will be the go-to application for customers to instantly configure, price, and request equipment rentals, and for internal teams to efficiently manage, validate, and confirm the accuracy of generated quotations and the availability of rental equipment for hire.  

#### **1.3. Mission**

To empower customers to instantly generate accurate, transparent equipment hire quotes online, while streamlining the validation and confirmation process for the business.

#### **1.4. Success Metrics (KPIs)**

* **User Growth & Engagement:**  
  * Monthly New User Registrations  
  * Daily Active Users (DAU) / Monthly Active Users (MAU)  
* **Conversion & Adoption:**  
  * Quote Generation Rate (Number of quotes generated / Number of sessions)  
  * Quote Submission Rate (Number of quotes submitted / Number of quotes generated)  
  * Quote-to-Confirmation Rate  
* **Operational Efficiency:**  
  * Average Time to Quote Validation (Time from submission to internal validation)  
* **User Satisfaction:**  
  * Net Promoter Score (NPS)  
  * Task Completion Rate (Users successfully generating and submitting a quote)

### **2\. Product Details**

#### **2.1. Target Audience**

* **Primary Users (Customers):**  
  * **Persona:** "Chris the Contractor." A project manager for a mid-sized construction company.  
  * **Demographics:** Male/Female, 30-55. Tech-savvy, uses web and mobile apps for work (e.g., project management tools, supplier portals).  
  * **Needs:** Needs to quickly source and price equipment for multiple projects with varying timelines. Requires clear, itemized quotes for budget approval. Values efficiency and accuracy to avoid project delays.  
* **Secondary Users (Internal Staff):**  
  * **Persona 1:** "Sarah the Hire Desk Coordinator." Responsible for validating quotes and coordinating logistics.  
  * **Needs:** A centralized dashboard to view incoming requests. Needs to quickly verify equipment details, rates, dates, and availability. Requires tools to communicate confirmations and manage the quote lifecycle.  
  * **Persona 2:** "Adam the Administrator." The business manager responsible for pricing strategy.  
  * **Needs:** A simple interface to manage the master rate card and quote templates without needing developer intervention. Needs to ensure pricing is up-to-date and applied correctly across all new quotes.

#### **2.2. User Stories & Journeys**

**User Stories:**

* **Customer:** "As a project manager, I want to browse equipment by category so that I can easily find what I need for my job."  
* **Customer:** "As a contractor, I want to select a start and end date for each piece of equipment so that I can create a single quote for a multi-phase project."  
* **Customer:** "As a user, I want the system to automatically calculate the total rental cost, including tiered discounts for longer hire periods and VAT, so I can get an accurate price instantly."  
* **Customer:** "As a user, I want to download a professionally formatted PDF of my quote so that I can submit it for internal approval."  
* **Customer:** "As a user, I want to submit my generated quote directly to the hire desk for validation and confirmation."  
* **Hire Desk Coordinator:** "As a hire desk coordinator, I want to receive a notification and see a new quote appear in my dashboard when a customer submits it so that I can act on it promptly."  
* **Administrator:** "As an administrator, I want a secure login to an admin panel where I can update the master rate card so that all new quotes reflect our latest pricing."

**Critical User Journey: New Customer Requesting a Quote**

1. **Discovery & Registration:** User lands on the HireDesk web app, finds it easy to understand, and decides to register for an account.  
2. **Browse:** User logs in and browses the "Excavators" category.  
3. **Selection:** User clicks on a "5-Ton Digger," views its details, specs, and images.  
4. **Configuration:** User selects a hire period: Start Date: July 1, 2025; End Date: July 10, 2025 (10-day duration). The system displays the daily rate corresponding to the 7-21 day bucket.  
5. **Add to Basket:** User adds the digger to their RFQ basket.  
6. **Add Services:** User is prompted to add optional services and selects "Professional Cleaning."  
7. **Generate Quote:** User proceeds to the RFQ page. The system displays an itemized list: Digger rental cost (Rate x 10 days), Cleaning service cost. It then calculates the subtotal, adds VAT (Total×1.20), and shows the final total.  
8. **Download & Submit:** User downloads a PDF of the quote for their records. Satisfied, they click "Submit for Validation."  
9. **Confirmation:** The user sees a confirmation message: "Your quote \#HD-1024 has been submitted. Our team will validate it and contact you shortly." An email confirmation is also sent.

#### **2.3. Core Features & Functionality (Prioritized)**

* **P0 (Must-Have):**

  * **User Authentication:** Secure user registration, login, and password management.  
  * **Equipment Catalog:** A multi-level catalog to browse categories and view individual equipment pages with images, descriptions, and specifications.  
  * **Dynamic Quoting Engine:** Core logic to calculate costs based on selected items, hire duration, and tiered rates from the master rate card. Must correctly calculate sub-totals, add-on services, and VAT.  
  * **RFQ Basket:** A persistent basket where users can add/remove multiple equipment items, each with its own unique start/end hire dates.  
  * **PDF Quote Generation:** Ability for the user to generate and download a PDF of their quote, formatted according to the master quote template.  
  * **Quote Submission Workflow:** A mechanism for users to submit their finalized quote to the internal hire desk for validation.  
  * **Admin Panel: Rate Card Management:** A secure admin interface to create, update, and delete entries in the master rate card (equipment, rates, and duration buckets).  
* **P1 (High-Want):**

  * **Hire Desk Dashboard:** An internal-facing dashboard for hire desk staff to view and manage a queue of submitted quotes (e.g., New, In-Progress, Confirmed, Canceled).  
  * **Gmail Integration:** Automated email sent from the system to the hire desk's Gmail inbox upon quote submission, including the attached pdf quotation.  
  * **Add-on Services:** Functionality to define and add supplementary services (e.g., delivery, insurance, cleaning) to a quote.  
  * **Admin Panel: Quote Template Management:** An interface for administrators to upload and manage the master quote template and master rate card used for PDF generation.  
* **P2 (Nice-to-Have):**

  * **Customer Dashboard:** A user-facing dashboard to view history of past quotes and their statuses.  
  * **Advanced Search & Filtering:** Allow users to filter equipment by specifications (e.g., weight, power, capacity).

### **3\. AI & Google Cloud Integration (Strategic Imperative)**

#### **3.1. AI-Powered Features**

* **Intelligent Catalog Search (Vertex AI Search):** The search bar for the equipment catalog will be powered by Vertex AI Search.  
  * **How it enhances UX:** Instead of relying on rigid keyword matching, users can search with natural language (e.g., "digger for a small garden for two weeks"). Vertex AI Search understands intent and context, delivering more relevant results and making the equipment discovery process faster and more intuitive.

#### **3.2. Google Cloud Architecture**

* **Compute & Hosting:**  
  * **Cloud Run:** To host the backend services (quoting engine, user management, admin APIs).  
  * **Firebase Hosting:** To serve the static frontend web application globally via its built-in CDN.  
* **Database:**  
  * **Cloud SQL (PostgreSQL):** To store relational data, including the user database, equipment catalog details, the master rate card, and all generated/submitted quotes. A relational database is ideal for enforcing data integrity and handling the structured, transactional nature of this data.  
* **AI & Machine Learning:**  
  * **Vertex AI Search:** To power the intelligent, natural language search over the equipment catalog.  
* **Data & Analytics:**  
  * **BigQuery:** All quote generation and submission events will be streamed to BigQuery. This will serve as the data warehouse for analyzing business trends, popular equipment, and user behavior to inform pricing and inventory strategy.  
  * **Google Analytics 4 (GA4):** For tracking frontend user interactions, conversion funnels, and user flows.  
* **Authentication & User Management:**  
  * **Firebase Authentication:** Provides a complete, secure, and easy-to-implement solution for user registration, sign-in (email/password), and session management.  
* **Storage:**  
  * **Google Cloud Storage:** To store all application assets, such as equipment images, equipment specifications, and to store the generated PDF quotes and master quote templates and master rate card.  
* **Integration:**  
  * **Gmail API:** To integrate with the hire desk's Gmail workspace for receiving email notifications with attached quotation pdf’s.

#### **3.3. Justification**

* **Cloud Run:** Chosen for its serverless nature, automatically scaling from zero to handle traffic spikes without manual intervention, making it cost-effective.  
* **Firebase Hosting:** Offers fast, secure web hosting with a global CDN out-of-the-box, ensuring a low-latency experience for all users.  
* **Cloud SQL:** A managed relational database service that handles patching, backups, and replication, allowing the team to focus on application development rather than database administration. Its relational structure is perfect for the defined data model.  
* **Vertex AI API:** These are managed, state-of-the-art AI services that allow us to embed powerful intelligence into the application without the massive overhead of building, training, and deploying our own models.  
* **BigQuery:** A serverless, highly scalable data warehouse designed for large-scale analytics, perfect for deriving business intelligence from application data.  
* **Firebase Authentication:** Drastically reduces development time for a critical security component, providing a robust and trusted authentication system.  
* **Google Cloud Storage:** Offers durable, scalable, and cost-effective object storage, ideal for static assets like images and documents.

### **4\. Design & UX**

#### **4.1. High-Level UX Principles**

* **Clarity:** The user should always understand where they are, what they need to do next, and how pricing is calculated. All costs, including taxes and fees, must be transparent.  
* **Efficiency:** The journey from finding an item to submitting a quote should be as short and frictionless as possible.  
* **Confidence:** The design should feel professional and trustworthy, giving the user confidence that the generated quote is accurate and their request will be handled professionally.  
* The UI will include a collapse/expand sidebar and overall minimalist look and feel

### **5\. Non-Functional Requirements**

#### **5.1. Performance**

* Server response time for API calls should be under 500ms.  
* PDF quote generation must complete in under 3 seconds.  
* Web app pages should achieve a Google Lighthouse performance score of 85+.

#### **5.2. Security**

* All user data must be encrypted at rest and in transit.  
* The application will use parameterized queries to prevent SQL injection attacks.  
* Admin access will be protected by multi-factor authentication (MFA).

#### **5.3. Scalability**

The architecture, built on Cloud Run, Cloud SQL, and Firebase, is designed to scale automatically to support a growing user base and increasing numbers of quotes without performance degradation.

### **6\. Additional Features**

#### **6.1. Add-On**

* **AI Recommendation Engine:** Use Vertex AI Recommendations to suggest complementary equipment or services based on the user's basket contents ("Customers who hire X also need Y").  
* **Advanced Admin Analytics:** A comprehensive BI dashboard (built on Looker Studio with BigQuery as a source) for administrators to analyze revenue trends, customer lifetime value, and equipment utilization.

---

This Product Requirements Document (PRD) will be maintained as a version-controlled Markdown file within a dedicated GitHub repository. This serves as the single source of truth for the product vision and requirements.

