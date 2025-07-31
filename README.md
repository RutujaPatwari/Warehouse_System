# 🏭 Smart Warehouse Reordering System

An intelligent inventory management system that helps businesses optimize their stock levels and automate reordering decisions.

![Python](https://img.shields.io/badge/Python-3.11-blue.svg)
![Flask](https://img.shields.io/badge/Flask-2.0.1-green.svg)
![React](https://img.shields.io/badge/React-18.2.0-blue.svg)
![Material UI](https://img.shields.io/badge/MaterialUI-5.13.0-purple.svg)

## 🚀 Features

- **Real-time Stock Monitoring**: Track current stock levels and daily sales
- **Intelligent Reordering**: Automatically calculate when to reorder based on:
  - Current stock levels
  - Average daily sales
  - Lead time
  - Safety stock threshold
- **Dynamic Reporting**: Generate comprehensive reorder reports showing:
  - Items that need reordering
  - Suggested quantities
  - Estimated costs
- **Demand Spike Simulation**: Test how sudden demand changes affect inventory
- **Visual Analytics**: Color-coded status indicators and progress bars
- **Criticality Management**: Prioritize items based on importance

## 🛠️ Tech Stack

- **Backend**: Python + Flask
- **Frontend**: React + Material UI
- **Data Storage**: CSV (easily upgradable to databases)
- **API**: RESTful endpoints

## 📋 Prerequisites

- Python 3.11 or higher
- Node.js 14.0 or higher
- npm/yarn

## ⚡ Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/smart-warehouse
   cd smart-warehouse
   ```

2. **Set up the backend**
   ```bash
   cd backend
   pip install -r requirements.txt
   python app.py
   ```

3. **Set up the frontend**
   ```bash
   cd frontend
   npm install
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

## 🔧 Configuration

The system uses several key parameters that can be adjusted:

- **Safety Stock Days**: Lead time + 5 days (default)
- **Planning Window**: 60 days (default)
- **Minimum Reorder Quantities**: Configurable per product
- **Criticality Levels**: High, Medium, Low

## 📊 Sample Data Format

```csv
id,name,current_stock,average_daily_sales,lead_time,min_reorder_qty,cost_per_unit,criticality
1,Smart LED TV,100,5,7,50,10,high
```

## 🌟 Key Features Explained

### Reorder Point Calculation
- Days Remaining = Current Stock ÷ Average Daily Sales
- Reorder Point = Lead Time + Safety Stock Days (5)

### Reorder Quantity Calculation
- Required Units = Average Daily Sales × Planning Window (60 days)
- Reorder Quantity = Max(Minimum Reorder Quantity, Required Units - Current Stock)

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

For support, email support@smartwarehouse.com or open an issue in this repository.

---
Made by [Rutuja Patwari]
