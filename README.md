# MongoDB-Assignment-02:

This repository contains MongoDB aggregation queries executed on a `products` collection. The queries are categorized by difficulty and include screenshots of output for verification.

## 📂 Project Structure

```
├── queries/
│   ├── easy.js
│   ├── medium.js
│   └── hard.js
├── screenshots/
│   ├── easy\1.png
│   ├── easy\2.png
│   ├── easy\3.png
│   ├── medium\1.png
│   ├── medium\2.png
│   ├── medium\3.png
│   ├── hard\1.png
│   ├── hard\2.png
│   └── hard\3.png
└── README.md
```

## Setup: Sample Data
* Open your `mongosh` or `mongo` shell.
* Switch to a new database (or an existing test database):
```js
use aggregationAssignmentDB
```

* Insert the following sample data into a collection named products:
```js
db.products.insertMany([
  { name: "Laptop Pro", category: "Electronics", price: 1200, quantity: 10, tags: ["computer", "portable", "work"], date_added: new Date("2023-01-15T10:00:00Z"), supplier: { name: "TechGlobe", location: "USA" } },
  { name: "Wireless Mouse", category: "Electronics", price: 25, quantity: 100, tags: ["peripheral", "computer", "wireless"], date_added: new Date("2023-02-01T11:30:00Z"), supplier: { name: "GadgetPro", location: "China" } },
  { name: "Mechanical Keyboard", category: "Electronics", price: 75, quantity: 50, tags: ["peripheral", "computer", "mechanical"], date_added: new Date("2023-01-20T14:00:00Z"), supplier: { name: "TechGlobe", location: "USA" } },
  { name: "Cotton T-Shirt", category: "Apparel", price: 20, quantity: 200, tags: ["clothing", "cotton", "casual"], date_added: new Date("2023-03-10T09:00:00Z"), supplier: { name: "FashionHub", location: "India" } },
  { name: "Denim Jeans", category: "Apparel", price: 60, quantity: 80, tags: ["clothing", "denim"], date_added: new Date("2023-03-01T16:45:00Z"), supplier: { name: "FashionHub", location: "India" } },
  { name: "Espresso Machine", category: "Home Goods", price: 250, quantity: 30, tags: ["kitchen", "appliance", "coffee"], date_added: new Date("2023-02-15T08:20:00Z"), supplier: { name: "HomeBest", location: "Germany" } },
  { name: "Smartwatch", category: "Electronics", price: 199, quantity: 25, tags: ["wearable", "gadget", "portable"], date_added: new Date("2023-04-01T12:00:00Z"), supplier: { name: "GadgetPro", location: "China" } },
  { name: "Leather Wallet", category: "Accessories", price: 45, quantity: 120, tags: ["fashion", "leather"], date_added: new Date("2023-03-20T10:10:00Z"), supplier: { name: "StyleCraft", location: "Italy" } },
  { name: "Yoga Mat", category: "Sports", price: 30, quantity: 90, tags: ["fitness", "exercise"], date_added: new Date("2023-04-05T13:00:00Z"), supplier: { name: "ActiveLife", location: "USA" } },
  { name: "Bluetooth Speaker", category: "Electronics", price: 80, quantity: 60, tags: ["audio", "portable", "wireless"], date_added: new Date("2023-02-25T17:00:00Z"), supplier: { name: "SoundWave", location: "USA" } }
]);

```

![SetupSampleData](https://github.com/Paras-Minfy/MongoDB-Assignment-02/blob/main/screenshots/setup/0.png)

---

## ✅ Easy Level

### 1. Products in the "Electronics" Category

```js
db.products.aggregate([
  { $match: { category: "Electronics" } }
]);
```

![Electronics Products](https://github.com/Paras-Minfy/MongoDB-Assignment-02/blob/main/screenshots/easy/1.png)

---

### 2. Count Products per Category

```js
db.products.aggregate([
  {
    $group: {
      _id: "$category",
      count: { $sum: 1 }
    }
  }
]);
```

![Category Count](https://github.com/Paras-Minfy/MongoDB-Assignment-02/blob/main/screenshots/easy/2.png)

---

### 3. Product Names and Prices (Descending by Price)

```js
db.products.aggregate([
  {
    $project: {
      _id: 0,
      name: 1,
      price: 1
    }
  },
  {
    $sort: { price: -1 }
  }
]);
```

![Price Sorted](https://github.com/Paras-Minfy/MongoDB-Assignment-02/blob/main/screenshots/easy/3.png)

---

## ✅ Medium Level

### 1. Total Quantity by Supplier

```js
db.products.aggregate([
  {
    $group: {
      _id: "$supplier.name",
      totalQuantity: { $sum: "$quantity" }
    }
  }
]);
```

![Supplier Quantity](https://github.com/Paras-Minfy/MongoDB-Assignment-02/blob/main/screenshots/medium/1.png)

---

### 2. Average Price by Tag

```js
db.products.aggregate([
  { $unwind: "$tags" },
  {
    $group: {
      _id: "$tags",
      averagePrice: { $avg: "$price" }
    }
  },
  {
    $sort: { averagePrice: -1 }
  }
]);
```

![Tag Average Price](https://github.com/Paras-Minfy/MongoDB-Assignment-02/blob/main/screenshots/medium/2.png)

---

### 3. Products Added in February 2023

```js
db.products.aggregate([
  {
    $match: {
      date_added: {
        $gte: ISODate("2023-02-01T00:00:00Z"),
        $lt: ISODate("2023-03-01T00:00:00Z")
      }
    }
  },
  {
    $project: {
      _id: 0,
      name: 1,
      category: 1,
      formattedDateAdded: {
        $dateToString: {
          format: "%Y-%m-%d",
          date: "$date_added"
        }
      }
    }
  }
]);
```

![February 2023](https://github.com/Paras-Minfy/MongoDB-Assignment-02/blob/main/screenshots/medium/3.png)

---

## ✅ Hard Level

### 1. Category Value and Classification

```js
db.products.aggregate([
  {
    $group: {
      _id: "$category",
      totalInventoryValue: {
        $sum: { $multiply: ["$price", "$quantity"] }
      }
    }
  },
  {
    $project: {
      categoryName: "$_id",
      totalInventoryValue: 1,
      valueClassification: {
        $switch: {
          branches: [
            {
              case: { $gt: ["$totalInventoryValue", 10000] },
              then: "High Value"
            },
            {
              case: { $gt: ["$totalInventoryValue", 5000] },
              then: "Medium Value"
            }
          ],
          default: "Standard Value"
        }
      }
    }
  }
]);
```

![Value Classification](https://github.com/Paras-Minfy/MongoDB-Assignment-02/blob/main/screenshots/hard/1.png)

---

### 2. Supplier with Most Expensive Product

```js
db.products.aggregate([
  {
    $sort: { price: -1 }
  },
  {
    $group: {
      _id: "$supplier.name",
      mostExpensiveProductName: { $first: "$name" },
      maxPrice: { $first: "$price" }
    }
  },
  {
    $project: {
      _id: 0,
      supplierName: "$_id",
      mostExpensiveProductName: 1,
      maxPrice: 1
    }
  }
]);
```

![Expensive Product per Supplier](https://github.com/Paras-Minfy/MongoDB-Assignment-02/blob/main/screenshots/hard/2.png)

---

### 3. Products Tagged "Portable" but NOT "Computer"

```js
db.products.aggregate([
  {
    $match: {
      tags: { $in: ["portable"], $nin: ["computer"] }
    }
  },
  {
    $project: {
      _id: 0,
      name: 1,
      tags: 1
    }
  }
]);
```

![Portable but Not Computer](https://github.com/Paras-Minfy/MongoDB-Assignment-02/blob/main/screenshots/hard/3.png)

---

## 🛠️ Requirements

* MongoDB v5 or above
* Mongo Shell or Compass
* Sample dataset with `products` collection and fields: `name`, `category`, `price`, `quantity`, `tags`, `supplier`, `date_added`
