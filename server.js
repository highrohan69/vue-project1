require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const Category = require("./models/Category");
const Product = require("./models/Product");
const Banner = require("./models/Banner");
const User = require("./models/User");
const cartRoutes = require('./routes/cart');

const app = express();
dotenv.config();


// Middleware
app.use(cors({ origin: "http://localhost:8081", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/ecommerce")
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch(err => console.error("Database connection error:", err));

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// Example Routes
app.use('/api/cart', cartRoutes);
// Routes for Category
app.get("/api/categories", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/categories", upload.single("image"), async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === "") return res.status(400).json({ message: "Category name is required" });

    const categoryData = { name };
    if (req.file) categoryData.image = `http://localhost:5000/uploads/${req.file.filename}`;

    const category = new Category(categoryData);
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: "Error saving category", error: err.message });
  }
});

// Routes for Banner
app.post("/api/banner", upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  try {
    const banner = new Banner({ image: `/uploads/${req.file.filename}` });
    await banner.save();
    res.status(201).json(banner);
  } catch (error) {
    res.status(500).json({ message: "Error saving banner", error });
  }
});

app.get("/api/banner", async (req, res) => {
  try {
    const banner = await Banner.findOne();
    if (!banner) return res.status(404).json({ error: "No banner found" });
    res.json(banner);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch banner" });
  }
});

// Routes for Product
app.get("/api/products", async (req, res) => {
  try {
    const products = req.query.categoryId
      ? await Product.find({ categoryId: req.query.categoryId })
      : await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/products", upload.single("image"), async (req, res) => {
  const { name, price, categoryId, description } = req.body;
  if (!name || !price || !categoryId) return res.status(400).json({ message: "Missing required fields" });

  const image = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const product = new Product({ name, price, categoryId, description, image });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error saving product", error });
  }
});

app.get("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete("/api/products/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Routes for Orders
app.post("/api/orders", async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json({ message: "Order added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error adding order: " + error.message });
  }
});

app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ date: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders: " + error.message });
  }
});



// সাইনআপ রুট
// সাইনআপ রুট
app.post('/api/signup', async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    // পাসওয়ার্ড হ্যাশ করা
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


// লগইন রুট
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
// Token Validation Middleware
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Decoded user data
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
  }
};

// Server Listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
