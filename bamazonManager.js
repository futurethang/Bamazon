// ### Challenge #2: Manager View (Next Level)

// * Create a new Node application called `bamazonManager.js`. Running this application will:

//   * List a set of menu options:

//     * View Products for Sale

//     * View Low Inventory

//     * Add to Inventory

//     * Add New Product

//   * If a manager selects `View Products for Sale`, the app should list every available item: the item IDs, names, prices, and quantities.

//   * If a manager selects `View Low Inventory`, then it should list all items with an inventory count lower than five.

//   * If a manager selects `Add to Inventory`, your app should display a prompt that will let the manager "add more" of any item currently in the store.

//   * If a manager selects `Add New Product`, it should allow the manager to add a completely new product to the store.

var mysql = require("mysql");
var inquirer = require("inquirer");
var colors = require('colors/safe');

colors.setTheme({
  inventory: ['yellow'],
  prompt: ['cyan', 'bold'],
  alert: ['red', 'bold'],
  total: ['green', 'bold'],
  info: ['red']
});

var productSelectionID;
var productSelectionQty;

function viewLowInventory() {
  //   * If a manager selects `View Low Inventory`, then it should list all items with an inventory count lower than five.
};

function addToInventory() {
  //   * If a manager selects `Add to Inventory`, your app should display a prompt that will let the manager "add more" of any item currently in the store.
  inquirer.prompt([
    {
      name: "enter_id",
      type: "input",
      message: colors.prompt("Enter the ID of the item you would like to update"), // Must add validate for existing ID based on DB contents
    },
    enterUnits,
  ]).then(function (inputs) {
    var existingQuantity;
    connection.query("SELECT * FROM products WHERE id=" + inputs.enter_id, function (err, res) {
      existingQuantity = res[0].stock_quantity;
      productSelectionID = inputs.enter_id;
      productSelectionQty = parseInt(inputs.enter_units);
      var newQuantity = productSelectionQty + existingQuantity;
      updateProduct(productSelectionID, newQuantity);
    })

  })
};

function addNewProduct() {
  //   * If a manager selects `Add New Product`, it should allow the manager to add a completely new product to the store.
};

function viewProductsForSale() {
  //   * If a manager selects `View Products for Sale`, the app should list every available item: the item IDs, names, prices, and quantities.
  readProducts();
};


var enterUnits = { // Inquirer object to get a Qty number
  name: "enter_units",
  type: "input",
  message: colors.prompt("Enter the number of units you would like to add"),
  validate: function validateInteger(enter_units) { // Must add check for existing QTY in following Then
    if (isNaN(enter_units)) {
      console.log("Please enter an integer for quantity")
    } else { return true };
  }
}

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon_db"
});

function toTitleCase(str) { // INPUT: STRING  -  OUTPUT: SAME STRING IN TITLE CASE
  str = str.toLowerCase().split(' ');
  for (var i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
  }
  return str.join(' ');
};

function proceedTransaction(id, qty) { // INPUTS: ID AND QTY  -  OUTPUT: REASSIGN GLOABLE VARS AND CALL QUANTITYCHECK()
  if (id !== null) { productSelectionID = id; }
  productSelectionQty = qty;
  quantityCheck(productSelectionID, productSelectionQty);
};

function readProducts() { // INPUT: NONE  -  OUTPUT: ALL PRODUCT TABLE CONTENTS
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    printProduct(res);
  });
};

function printProduct(res) { // INPUT: SQL QUERY RETURN  -  OUTPUT: DISPLAY LOG OF ITEM DETAILS
  res.forEach((item) => {
    console.log(colors.inventory(
      "\n-------------\n" +
      toTitleCase(item.product_name) + " - Product ID: " + item.id + "\n" +
      "Department: " + toTitleCase(item.department_name) + "\n" +
      "Price: $" + item.price + "\n" +
      "Qty. In Stock: " + item.stock_quantity +
      "\n--------------"
    ));
  })
};

function updateProduct(id, qty) {
  console.log("update fires -  id: " + id + "  qty: " + qty);

  var query = connection.query(
    "UPDATE products SET ? WHERE ?",
    [
      {
        stock_quantity: qty
      },
      {
        id: id
      }
    ],
    function (err, res) {
      // console.log(res.affectedRows + " products updated!\n");
    }
  );
  // CALCULATE TOTAL COST OF TRANSACTION
  connection.query("SELECT * FROM products WHERE id=" + id, function (err, res) {
    if (err) throw err;
    printProduct(res);
  });
};

function quantityCheck(id, qty) { // INPUT: ID AND QTY  -  OUTPUT: CHOOSE NEW QTY OR CONTINUE TRANSACTION
  // 
  connection.query("SELECT * FROM products WHERE id=" + id, function (err, res) {
    if (err) throw err;
    var itemQuantity = res[0].stock_quantity;
    var addQuantity = qty;
    var itemPrice = res[0].price;
    printProduct(res);
    if (itemQuantity < qty) {
      console.log(colors.alert("\nThere are not enough in stock to fill your order.\n" +
        "There are " + itemQuantity + " left in stock." +
        "\nPlease make update your quantity.\n"));
      inquirer.prompt([ // take back to select another quantity
        enterUnits // only asking for update to QTY, ID is held in global property
      ]).then(function (inputs) {
        productSelectionQty = inputs.enter_units; // Update global QTY variable
        console.log("ID: " + productSelectionID + " QTY: " + productSelectionQty)
        proceedTransaction(productSelectionID, productSelectionQty);
      })
    } else { // continue with the purchase
      var newQuantity = itemQuantity - qty;
      console.log(colors.total("\nTransaction Total: $" + (qty * itemPrice).toFixed(2)));
      console.log(colors.info("\n\nUpdated Product Record:"))
      updateProduct(id, newQuantity);
      // console.log(res)

    }
  })
};

///// INQUIRER FUNCTIONS
function managerInquiry() { // INPUTS: USER CHOICES FROM PROMPTS  -  OUTPUTS: SERT GLOBAL VARS AND CALL PROCEEDTRANSACTION()
  inquirer.prompt([
    {
      type: "list",
      name: "manager_options",
      choices: [
        "View Products For Sale",
        "View Low Inventory",
        "Add To Inventory",
        "Add New Product"
      ]
    }
  ]).then(function (inputs) {
    console.log(inputs.manager_options);
    switch (inputs.manager_options) {
      case "View Products For Sale":
        viewProductsForSale();
        break;
      case "View Low Inventory":
        viewLowInventory();
        break;
      case "Add To Inventory":
        addToInventory();
        break;
      case "Add New Product":
        addNewProduct();
        break;
      default:
        break;
    }
  })
};


managerInquiry();