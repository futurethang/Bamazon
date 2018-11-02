
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

var enterUnits = { // Inquirer object to get a Qty number
  name: "enter_units",
  type: "input",
  message: colors.prompt("Enter the number of units you would like to purchase"),
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
  var table = new Table({
    head: ['Product ID', 'Product', 'Department', 'Price', 'Qty', 'Product Sales'],
    colWidths: [10, 20, 25, 15, 10, 18]
  });
  res.forEach((item) => {
    table.push(
      [item.id, item.product_name, item.department_name, "$" + item.price, item.stock_quantity, "$" + item.product_sales]
    )
  })
  console.log(table.toString());
};

function updateProduct(id, qty, tranTotal) {
  var query = connection.query(
    "UPDATE products SET ? WHERE ?",
    [
      {
        stock_quantity: qty,
        product_sales: tranTotal
      },
      {
        id: id
      },
    ],
    function (err, res) {
      // console.log(res.affectedRows + " products updated!\n");
    }
  );
  // CALCULATE TOTAL COST OF TRANSACTION
  connection.query("SELECT * FROM products WHERE id=" + id, function (err, res) {
    if (err) throw err;
    printProduct(res);
    purchaseInquiry();
  });
};

function quantityCheck(id, qty) { // INPUT: ID AND QTY  -  OUTPUT: CHOOSE NEW QTY OR CONTINUE TRANSACTION
  connection.query("SELECT * FROM products WHERE id=" + id, function (err, res) {
    if (err) throw err;
    var itemQuantity = res[0].stock_quantity;
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
      var transactionTotal = (qty * itemPrice).toFixed(2);
      console.log(colors.total("\nTransaction Total: $" + transactionTotal));
      console.log(colors.info("\n\nUpdated Product Record:"))
      updateProduct(id, newQuantity, transactionTotal);
    }
  })
};

///// INQUIRER FUNCTIONS
function purchaseInquiry() { // INPUTS: USER CHOICES FROM PROMPTS  -  OUTPUTS: SERT GLOBAL VARS AND CALL PROCEEDTRANSACTION()
  inquirer.prompt([
    {
      name: "enter_id",
      type: "input",
      message: colors.prompt("Enter the ID of the item you would like to purchase"), // Must add validate for existing ID based on DB contents
    },
    enterUnits,
  ]).then(function (inputs) {
    productSelectionID = inputs.enter_id;
    productSelectionQty = parseInt(inputs.enter_units);
    proceedTransaction(productSelectionID, productSelectionQty);
  })
};

readProducts();
setTimeout(purchaseInquiry, 1000);


// Build promise using https://flaviocopes.com/javascript-promises/
// retunr to menu top UX