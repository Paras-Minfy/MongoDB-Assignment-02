// 1. Total Quantity of Products by Supplier
db.products.aggregate([
  {
    $group: {
      _id: "$supplier.name",
      totalQuantity: { $sum: "$quantity" }
    }
  }
]);

// 2. Average Price of Products per Tag
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

// 3. Products Added in February 2023
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
