// 5. Then create a Node application called `bamazonCustomer.js`. Running this application will first display all of the items available for sale. Include the ids, names, and prices of products for sale.

// 6. The app should then prompt users with two messages.

//    * The first should ask them the ID of the product they would like to buy.
//    * The second message should ask how many units of the product they would like to buy.

// 7. Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.

//    * If not, the app should log a phrase like `Insufficient quantity!`, and then prevent the order from going through.

// 8. However, if your store _does_ have enough of the product, you should fulfill the customer's order.
//    * This means updating the SQL database to reflect the remaining quantity.
//    * Once the update goes through, show the customer the total cost of their purchase.

var mysql = require("mysql");
var inquirer = require("inquirer");

var productSelectionID;
var productSelectionQty;

var enterUnits = {
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

function proceedTransaction(id, qty) {
  if (id !== null) { productSelectionID = id; }
  productSelectionQty = qty;
  quantityCheck(productSelectionID, productSelectionQty);
}

function toTitleCase(str) {
  str = str.toLowerCase().split(' ');
  for (var i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
  }
  return str.join(' ');
};

function quantityCheck(id, qty) {
  console.log("SELECT stock_quantity FROM products WHERE id=" + id);
  connection.query("SELECT stock_quantity FROM products WHERE id=" + id, function (err, res) {
    if (err) throw err;
    if (res[0].stock_quantity < qty) {
      console.log("There are not enough in stock to fill your order. Please make another selection.")
      inquirer.prompt([ // take back to select another quantity
        enterUnits // only asking for update to QTY, ID is held in global property
      ]).then(function (inputs) {
        productSelectionQty = inputs.enter_units; // Update global QTY variable
        console.log("ID: " + productSelectionID + " QTY: " + productSelectionQty)
        proceedTransaction(productSelectionID, productSelectionQty);
      })
    } else { console.log(res) }
    // continue with the purchase
    // console.log(res[0]['stock_quantity'])
    // connection.end();
  })
}

function readProducts() {
  console.log("Selecting all products...\n");
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
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
    // connection.end();
  });
}

///// INQUIRER FUNCTIONS
function purchaseInquiry() {
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
}

readProducts();
purchaseInquiry();