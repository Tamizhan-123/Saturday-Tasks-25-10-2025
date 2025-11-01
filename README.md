# ClickCart E-commerce Application

A full-stack e-commerce application built with Spring Boot (Backend) and React (Frontend).

## Features

- **JWT Token-based Authentication**: Secure user authentication with role-based access control
- **Product Management**: Admin can create, edit, delete products; Users can browse and search products
- **Shopping Cart**: Add products to cart and manage quantities
- **Stripe Payment Integration**: Secure payment processing
- **Order Management**: Complete order lifecycle management
- **Email & SMS Notifications**: Automated notifications for order confirmations and status updates
- **Role-based Access**: Admin and User roles with different permissions

## Tech Stack

### Backend

- Spring Boot 3.5.7
- Spring Security with JWT
- Spring Data JPA
- MySQL Database
- Stripe Payment API
- Twilio SMS Service
- Spring Mail

### Frontend

- React 18
- React Router
- Axios for API calls
- Stripe React Components
- Context API for state management

## Setup Instructions

### Prerequisites

- Java 17+
- Maven 3.6+
- MySQL 8.0+
- Node.js 16+
- npm or yarn

### Backend Setup

1. **Database Setup**

   ```sql
   CREATE DATABASE clickcart;
   ```

2. **Update Configuration**
   Edit `backend/src/main/resources/application.properties`:

   ```properties
   # Update database credentials
   spring.datasource.username=your_username
   spring.datasource.password=your_password

   # Update email configuration
   spring.mail.username=your-email@gmail.com
   spring.mail.password=your-app-password

   # Update Stripe keys
   stripe.secret.key=sk_test_your_stripe_secret_key
   stripe.publishable.key=pk_test_your_stripe_publishable_key

   # Update Twilio configuration
   twilio.account.sid=your_twilio_account_sid
   twilio.auth.token=your_twilio_auth_token
   twilio.phone.number=your_twilio_phone_number
   ```

3. **Run the Application**
   ```bash
   cd backend
   mvn spring-boot:run
   ```

### Frontend Setup

1. **Install Dependencies**

   ```bash
   cd frontend
   npm install
   ```

2. **Update Stripe Configuration**
   Edit `frontend/src/pages/Checkout.js`:

   ```javascript
   const stripePromise = loadStripe("pk_test_your_stripe_publishable_key");
   ```

3. **Run the Application**
   ```bash
   npm start
   ```

## API Endpoints

### Authentication

- `POST /api/auth/signin` - User login
- `POST /api/auth/signup` - User registration

### Products

- `GET /api/products` - Get all active products
- `GET /api/products/{id}` - Get product by ID
- `GET /api/products/search?keyword={keyword}` - Search products
- `GET /api/products/category/{category}` - Get products by category
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/{id}` - Update product (Admin only)
- `DELETE /api/products/{id}` - Delete product (Admin only)

### Orders

- `POST /api/orders/create` - Create order
- `GET /api/orders/my-orders` - Get user orders
- `GET /api/orders/{id}` - Get order by ID
- `PUT /api/orders/{id}/status` - Update order status (Admin only)
- `GET /api/orders/admin/all` - Get all orders (Admin only)

### Payment

- `POST /api/payment/create-payment-intent` - Create Stripe payment intent
- `POST /api/payment/confirm-payment/{paymentIntentId}` - Confirm payment

### User Management

- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

## Default Admin User

To create an admin user, you can either:

1. Register a new user and manually update the database to add ADMIN role
2. Use the application's registration endpoint and modify the role assignment logic

## Environment Variables

Make sure to set up the following services:

### Stripe

1. Create a Stripe account
2. Get your publishable and secret keys from the dashboard
3. Update the configuration files

### Twilio (SMS)

1. Create a Twilio account
2. Get your Account SID, Auth Token, and Phone Number
3. Update the configuration files

### Email (Gmail)

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password
3. Update the email configuration

## Testing

### Backend Testing

```bash
cd backend
mvn test
```

### Frontend Testing

```bash
cd frontend
npm test
```

## Deployment

### Backend Deployment

1. Build the JAR file: `mvn clean package`
2. Deploy to your preferred cloud platform (AWS, Heroku, etc.)

### Frontend Deployment

1. Build the production bundle: `npm run build`
2. Deploy the `build` folder to your preferred hosting service

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
<img width="806" height="501" alt="image" src="https://github.com/user-attachments/assets/596309cb-3c29-4350-a2ed-4b23b35480cc" />

<img width="1918" height="843" alt="image" src="https://github.com/user-attachments/assets/caf346fa-a098-47dd-bc35-9b6517bd8fcd" />

<img width="1111" height="500" alt="image" src="https://github.com/user-attachments/assets/1de0a5e5-2ad8-4590-bdeb-ea281800c365" />

<img width="1192" height="566" alt="image" src="https://github.com/user-attachments/assets/c974aaa8-0cae-4cf7-944b-236cd0b2c50b" />





