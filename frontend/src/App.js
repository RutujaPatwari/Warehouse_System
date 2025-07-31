import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  LinearProgress,
  Typography,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';

const getCriticalityColor = (criticality) => {
  switch (criticality) {
    case 'high': return 'error';
    case 'medium': return 'warning';
    case 'low': return 'success';
    default: return 'default';
  }
};

const App = () => {
  const [products, setProducts] = useState([]);
  const [simulatedProduct, setSimulatedProduct] = useState(null);
  const [reportOpen, setReportOpen] = useState(false);
  const [report, setReport] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const response = await fetch('http://localhost:5000/products');
    const data = await response.json();
    setProducts(data);
  };

  const simulateSpike = async (productId) => {
    const response = await fetch('http://localhost:5000/simulate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product_id: productId,
        spike_factor: 3,
        duration: 7
      })
    });
    const data = await response.json();
    setSimulatedProduct(data);
  };

  const fetchReport = async () => {
    const response = await fetch('http://localhost:5000/reorder-report');
    const data = await response.json();
    setReport(data);
    setReportOpen(true);
  };

  const getDaysRemainingColor = (days, leadTime) => {
    if (days < leadTime) return 'error';
    if (days < leadTime + 5) return 'warning';
    return 'success';
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom sx={{ mt: 3 }}>
        Warehouse Inventory Management
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={fetchReport}
        sx={{ mb: 2 }}
      >
        Generate Reorder Report
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Daily Sales</TableCell>
              <TableCell>Days Remaining</TableCell>
              <TableCell>Criticality</TableCell>
              <TableCell>Lead Time</TableCell>
              <TableCell>Reorder Qty</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => {
              const simulated = simulatedProduct?.id === product.id;
              const displayProduct = simulated ? simulatedProduct : product;
              return (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{displayProduct.current_stock}</TableCell>
                  <TableCell>{displayProduct.average_daily_sales}</TableCell>
                  <TableCell>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min((displayProduct.days_remaining / (displayProduct.lead_time + 5)) * 100, 100)}
                      color={getDaysRemainingColor(displayProduct.days_remaining, displayProduct.lead_time)}
                      sx={{ mb: 1 }}
                    />
                    {displayProduct.days_remaining.toFixed(1)} days
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={product.criticality}
                      color={getCriticalityColor(product.criticality)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{product.lead_time} days</TableCell>
                  <TableCell>
                    {displayProduct.needs_reorder ? (
                      <Typography color="error">
                        {displayProduct.reorder_qty} units
                      </Typography>
                    ) : '-'}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => simulated ? setSimulatedProduct(null) : simulateSpike(product.id)}
                    >
                      {simulated ? 'Reset' : 'Simulate Spike'}
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={reportOpen} onClose={() => setReportOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Reorder Report</DialogTitle>
        <DialogContent>
          {report && (
            <>
              <Typography variant="h6" gutterBottom>
                Total Items to Reorder: {report.total_items}
              </Typography>
              <Typography variant="h6" gutterBottom>
                Total Estimated Cost: ${report.total_cost.toFixed(2)}
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell>Current Stock</TableCell>
                      <TableCell>Days Remaining</TableCell>
                      <TableCell>Reorder Quantity</TableCell>
                      <TableCell>Cost Per Unit</TableCell>
                      <TableCell>Estimated Cost</TableCell>
                      <TableCell>Criticality</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {report.items.map((item) => (
                      <TableRow key={item.name}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.current_stock}</TableCell>
                        <TableCell>{item.days_remaining.toFixed(1)} days</TableCell>
                        <TableCell>{item.reorder_qty}</TableCell>
                        <TableCell>${item.cost_per_unit}</TableCell>
                        <TableCell>${item.estimated_cost.toFixed(2)}</TableCell>
                        <TableCell>
                          <Chip 
                            label={item.criticality}
                            color={getCriticalityColor(item.criticality)}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReportOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default App;
