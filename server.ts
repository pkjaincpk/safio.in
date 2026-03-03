import express from "express";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import { Product, Order } from "./types";
import { INITIAL_PRODUCTS } from "./constants";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // In-memory data store
  let products: Product[] = [...INITIAL_PRODUCTS];
  let orders: Order[] = [];

  // API Routes
  app.get("/api/products", (req, res) => {
    res.json(products);
  });

  app.post("/api/products", (req, res) => {
    const newProduct: Product = {
      ...req.body,
      id: `p-${Date.now()}`,
      stock: req.body.stock || {}
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
  });

  app.put("/api/products/:id", (req, res) => {
    const { id } = req.params;
    const index = products.findIndex((p) => p.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...req.body };
      res.json(products[index]);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  });

  app.delete("/api/products/:id", (req, res) => {
    const { id } = req.params;
    products = products.filter((p) => p.id !== id);
    res.status(204).send();
  });

  app.post("/api/orders", (req, res) => {
    const newOrder: Order = {
      ...req.body,
      id: `ord-${Date.now()}`,
      date: new Date().toISOString(),
      status: 'pending'
    };
    orders.push(newOrder);
    
    // Update stock levels
    newOrder.items.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      if (product && product.stock[item.screenSize]) {
        product.stock[item.screenSize] = Math.max(0, product.stock[item.screenSize] - item.quantity);
      }
    });

    res.status(201).json(newOrder);
  });

  app.get("/api/stats", (req, res) => {
    const totalRevenue = orders.reduce((acc, curr) => acc + curr.total, 0);
    const lowStockCount = products.filter(p => 
      (Object.values(p.stock) as number[]).some(s => s < 5)
    ).length;

    res.json({
      totalRevenue,
      activeOrders: orders.filter(o => o.status === 'pending').length,
      totalCustomers: 2400, // Mocked
      lowStockCount
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
