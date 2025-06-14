# Compliance Dashboard

A modern web application built with Vue.js 3, Node.js, and MySQL for monitoring and analyzing compliance data across different areas and brands.

## 🚀 Features

- **Interactive Dashboard**: Real-time compliance monitoring with visual charts and data tables
- **Advanced Filtering**: Filter data by area, date range, and brand
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Updates**: Data refreshes automatically when filters are applied
- **Modern UI**: Clean, professional interface with smooth animations
- **RESTful API**: Well-structured backend API for data management

## 🛠 Tech Stack

### Frontend
- **Vue.js 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe JavaScript
- **Chart.js** - Interactive charts and visualizations
- **Vue-ChartJS** - Vue.js wrapper for Chart.js
- **Axios** - HTTP client for API requests
- **Vite** - Fast build tool and dev server

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MySQL2** - MySQL database driver
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Database
- **MySQL** - Relational database management system

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (version 16 or higher)
- **npm** or **yarn**
- **MySQL** (version 5.7 or higher)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vue-nodejs-mysql-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Database Setup**
   - Make sure MySQL is running on your system
   - The application will automatically create the `dev-test` database
   - Update the `.env` file if you need to change database credentials

4. **Environment Configuration**
   
   The `.env` file contains the following configuration:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=dev-test
   PORT=3001
   ```

## 🚀 Running the Application

### Development Mode
Start both frontend and backend servers concurrently:
```bash
npm run dev
```

This will start:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001

### Individual Services
You can also run services separately:

**Frontend only:**
```bash
npm run dev:client
```

**Backend only:**
```bash
npm run dev:server
```

### Production Build
```bash
npm run build
```

## 📊 Database Schema

The application uses the following database structure:

### Tables

1. **store_account**
   - `account_id` (Primary Key)
   - `account_name`

2. **store_area**
   - `area_id` (Primary Key)
   - `area_name`

3. **brand**
   - `brand_id` (Primary Key)
   - `brand_name`

4. **store**
   - `store_id` (Primary Key)
   - `store_name`
   - `account_id` (Foreign Key)
   - `area_id` (Foreign Key)
   - `is_active`

5. **product**
   - `product_id` (Primary Key)
   - `product_name`
   - `brand_id` (Foreign Key)

6. **report_product**
   - `report_id` (Primary Key)
   - `store_id` (Foreign Key)
   - `product_id` (Foreign Key)
   - `compliance` (Boolean)
   - `tanggal` (Date)

### Sample Data

The application automatically populates the database with sample data including:
- 3 Store accounts
- 5 Areas (DKI Jakarta, Jawa Barat, Kalimantan, Jawa Tengah, Bali)
- 2 Brands (ROTI TAWAR, SUSU KALENG)
- 8 Stores across different areas
- 4 Products
- Sample compliance reports

## 🔌 API Endpoints

### GET /api/areas
Returns all store areas.

**Response:**
```json
[
  {
    "area_id": 1,
    "area_name": "DKI Jakarta"
  }
]
```

### GET /api/brands
Returns all brands.

**Response:**
```json
[
  {
    "brand_id": 1,
    "brand_name": "ROTI TAWAR"
  }
]
```

### GET /api/compliance-report
Returns compliance data by area with optional filtering.

**Query Parameters:**
- `area_id` (optional) - Filter by specific area
- `date_from` (optional) - Start date filter
- `date_to` (optional) - End date filter
- `brand_id` (optional) - Filter by specific brand

**Response:**
```json
[
  {
    "area_name": "DKI Jakarta",
    "total_reports": 4,
    "compliant_reports": 3,
    "compliance_percentage": 75.0
  }
]
```

### GET /api/brand-compliance
Returns brand compliance data by area with optional filtering.

**Query Parameters:**
- `area_id` (optional) - Filter by specific area
- `date_from` (optional) - Start date filter
- `date_to` (optional) - End date filter

**Response:**
```json
[
  {
    "brand_name": "ROTI TAWAR",
    "area_name": "DKI Jakarta",
    "total_reports": 2,
    "compliant_reports": 2,
    "compliance_percentage": 100
  }
]
```

## 📱 Features Overview

### Dashboard Components

1. **Filter Controls**
   - Area selection dropdown
   - Date range picker (from/to)
   - Brand selection dropdown
   - View and Reset buttons

2. **Metrics Cards**
   - Overall compliance percentage
   - Total areas count
   - Active brands count

3. **Compliance Chart**
   - Interactive bar chart showing compliance by area
   - Hover tooltips with detailed information
   - Responsive design

4. **Compliance Table**
   - Brand compliance breakdown by area
   - Color-coded percentage bars
   - Responsive table design

### Compliance Calculation

The compliance percentage is calculated using the formula:
```
Compliance % = (SUM(compliant_reports) / Total_Reports) × 100
```

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface with gradient backgrounds
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **Interactive Elements**: Hover effects, smooth transitions, and animations
- **Loading States**: Visual feedback during data loading
- **Error Handling**: Graceful error handling with user-friendly messages

## 🔧 Development

### Project Structure
```
├── src/
│   ├── components/
│   │   ├── Dashboard.vue          # Main dashboard component
│   │   ├── FilterControls.vue     # Filter controls component
│   │   ├── ComplianceChart.vue    # Chart visualization component
│   │   └── ComplianceTable.vue    # Data table component
│   ├── App.vue                    # Root component
│   ├── main.ts                    # Application entry point
│   └── style.css                  # Global styles
├── server/
│   └── index.js                   # Express server and API routes
├── package.json                   # Dependencies and scripts
└── .env                          # Environment configuration
```

### Available Scripts

- `npm run dev` - Start development servers (frontend + backend)
- `npm run dev:client` - Start only frontend development server
- `npm run dev:server` - Start only backend development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure MySQL is running
   - Check database credentials in `.env` file
   - Verify database user has proper permissions

2. **Port Already in Use**
   - Change the PORT in `.env` file
   - Kill existing processes using the ports

3. **Dependencies Issues**
   - Delete `node_modules` and `package-lock.json`
   - Run `npm install` again
