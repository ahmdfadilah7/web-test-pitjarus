import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL connection
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'dev-test'
};

let connection;

async function initializeDatabase() {
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected to MySQL database');
    
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}

// API Routes
app.get('/api/areas', async (req, res) => {
  try {
    const [rows] = await connection.execute('SELECT * FROM store_area ORDER BY area_name');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/brands', async (req, res) => {
  try {
    const [rows] = await connection.execute('SELECT * FROM product_brand ORDER BY brand_name');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/compliance-report', async (req, res) => {
  try {
    const { area_id, date_from, date_to, brand_id } = req.query;
    
    let query = `
      SELECT 
        sa.area_name,
        COUNT(rp.report_id) as total_reports,
        SUM(CASE WHEN rp.compliance = TRUE THEN 1 ELSE 0 END) as compliant_reports,
        ROUND((SUM(CASE WHEN rp.compliance = TRUE THEN 1 ELSE 0 END) / COUNT(rp.report_id)) * 100, 1) as compliance_percentage
      FROM report_product rp
      JOIN store s ON rp.store_id = s.store_id
      JOIN store_area sa ON s.area_id = sa.area_id
      JOIN product p ON rp.product_id = p.product_id
      WHERE 1=1
    `;
    
    const params = [];
    
    if (area_id) {
      query += ' AND sa.area_id = ?';
      params.push(area_id);
    }
    
    if (date_from) {
      query += ' AND rp.tanggal >= ?';
      params.push(date_from);
    }
    
    if (date_to) {
      query += ' AND rp.tanggal <= ?';
      params.push(date_to);
    }
    
    if (brand_id) {
      query += ' AND p.brand_id = ?';
      params.push(brand_id);
    }
    
    query += ' GROUP BY sa.area_id, sa.area_name ORDER BY sa.area_name';
    
    const [rows] = await connection.execute(query, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/brand-compliance', async (req, res) => {
  try {
    const { area_id, date_from, date_to } = req.query;
    
    let query = `
      SELECT 
        b.brand_name,
        sa.area_name,
        COUNT(rp.report_id) as total_reports,
        SUM(CASE WHEN rp.compliance = TRUE THEN 1 ELSE 0 END) as compliant_reports,
        ROUND((SUM(CASE WHEN rp.compliance = TRUE THEN 1 ELSE 0 END) / COUNT(rp.report_id)) * 100, 0) as compliance_percentage
      FROM report_product rp
      JOIN store s ON rp.store_id = s.store_id
      JOIN store_area sa ON s.area_id = sa.area_id
      JOIN product p ON rp.product_id = p.product_id
      JOIN product_brand b ON p.brand_id = b.brand_id
      WHERE 1=1
    `;
    
    const params = [];
    
    if (area_id) {
      query += ' AND sa.area_id = ?';
      params.push(area_id);
    }
    
    if (date_from) {
      query += ' AND rp.tanggal >= ?';
      params.push(date_from);
    }
    
    if (date_to) {
      query += ' AND rp.tanggal <= ?';
      params.push(date_to);
    }
    
    query += ' GROUP BY b.brand_id, b.brand_name, sa.area_id, sa.area_name ORDER BY b.brand_name, sa.area_name';
    
    const [rows] = await connection.execute(query, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Initialize database and start server
initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});