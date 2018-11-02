
var mysql = require("mysql");
var inquirer = require("inquirer");
var colors = require('colors/safe');
var Table = require('cli-table');

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
  connection.query("SELECT * FROM products WHERE stock_quantity<5", function (err, res) {
    if (res.length === 0) { console.log(colors.info("All products are well stocked!")) }
    printProduct(res);
    managerInquiry();
  })
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
      // managerInquiry();
    })

  })
};

function addNewProduct() { //   * If a manager selects `Add New Product`, it should allow the manager to add a completely new product to the store.
  inquirer.prompt([
    {
      name: "new_product",
      type: "input",
      message: "What is the new product named?"
    },
    {
      name: "department",
      type: "input",
      message: "What is the new product's department?"
    },
    {
      name: "price",
      type: "input",
      message: "What is the new product's price?",
      validate: function validateInteger(price) { // Must add check for existing QTY in following Then
        if (isNaN(price)) {
          console.log("Please enter an integer for quantity")
        } else { return true };
      }
    },
    {
      name: "starting_quantity",
      type: "input",
      message: "How many are available?",
      validate: function validateInteger(starting_quantity) { // Must add check for existing QTY in following Then
        if (isNaN(starting_quantity)) {
          console.log("Please enter an integer for quantity")
        } else { return true };
      }
    }
  ]).then(function (inputs) {
    connection.query(
    "INSERT INTO products SET ?",
        {
          product_name: inputs.new_product,
          department_name: inputs.department,
          price: inputs.price,
          stock_quantity: inputs.starting_quantity
        },
      function (err, res) {
        if (err) throw err;
        console.log(res.affectedRows + " product inserted!\n");
      })
  managerInquiry();  
  })
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
    managerInquiry();
  });
};

function printProduct(res) { // INPUT: SQL QUERY RETURN  -  OUTPUT: DISPLAY LOG OF ITEM DETAILS
  var table = new Table({
    head: ['Product ID', 'Product', 'Department', 'Price', 'Qty', 'Product Sales'],
    colWidths: [12, 20, 25, 15, 10, 18]
  });
  res.forEach((item) => {
    table.push(
      [item.id, item.product_name, item.department_name, "$" + item.price, item.stock_quantity, "$" + item.product_sales]
    )
  })
  console.log(table.toString());
};

function updateProduct(id, qty) {
  console.log("update fires -  id: " + id + "  qty: " + qty);

  connection.query(
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
      console.log(res.affectedRows + " products updated!\n");
    }
  );
  // CALCULATE TOTAL COST OF TRANSACTION
  connection.query("SELECT * FROM products WHERE id=" + id, function (err, res) {
    if (err) throw err;
    printProduct(res);
    managerInquiry();
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
  console.log("\n----------------------------------------\n");
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
// ANY IMPROVEMENTS TO UX?
// https://www.npmjs.com/package/cli-table

