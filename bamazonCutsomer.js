// 8. However, if your store _does_ have enough of the product, you should fulfill the customer's order.
//    * This means updating the SQL database to reflect the remaining quantity.
//    * Once the update goes through, show the customer the total cost of their purchase.

var mysql = require("mysql");
var inquirer = require("inquirer");

var productSelectionID;
var productSelectionQty;

var enterUnits = { // Inquirer object to get a Qty number
  name: "enter_units",
  type: "input",
  message: "Enter the number of units you would like to purchase",
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
    console.log(
      "\n-------------\n" +
      toTitleCase(item.product_name) + " - Product ID: " + item.id + "\n" +
      "Department: " + toTitleCase(item.department_name) + "\n" +
      "Price: $" + item.price + "\n" +
      "Qty. In Stock: " + item.stock_quantity +
      "\n--------------"
    );
  })
};

function updateProduct(id, qty) {
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
  connection.query("SELECT * FROM products WHERE id=" + id, function (err, res) {
    if (err) throw err;
    var itemQuantity = res[0].stock_quantity;
    var itemPrice = res[0].price;
    printProduct(res);
    if (itemQuantity < qty) {
      console.log("\nThere are not enough in stock to fill your order.\n" +
        "There are " + itemQuantity + " left in stock." +
        "\nPlease make update your quantity.\n");
      inquirer.prompt([ // take back to select another quantity
        enterUnits // only asking for update to QTY, ID is held in global property
      ]).then(function (inputs) {
        productSelectionQty = inputs.enter_units; // Update global QTY variable
        console.log("ID: " + productSelectionID + " QTY: " + productSelectionQty)
        proceedTransaction(productSelectionID, productSelectionQty);
      })
    } else { // continue with the purchase
      var newQuantity = itemQuantity - qty;
      console.log("\nTransaction Total: $" + (qty * itemPrice).toFixed(2));
      console.log("\n\nUpdated Product Record:")
      updateProduct(id, newQuantity);
      // console.log(res)

    }
  })
};

///// INQUIRER FUNCTIONS
function purchaseInquiry() { // INPUTS: USER CHOICES FROM PROMPTS  -  OUTPUTS: SERT GLOBAL VARS AND CALL PROCEEDTRANSACTION()
  inquirer.prompt([
    {
      name: "enter_id",
      type: "input",
      message: "Enter the ID of the item you would like to purchase", // Must add validate for existing ID based on DB contents
    },
    enterUnits,
  ]).then(function (inputs) {
    productSelectionID = inputs.enter_id;
    productSelectionQty = parseInt(inputs.enter_units);
    proceedTransaction(productSelectionID, productSelectionQty);
  })
};

readProducts();
purchaseInquiry();