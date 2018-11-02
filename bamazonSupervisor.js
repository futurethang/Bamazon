// REQUIRE NPMS
var mysql = require("mysql");
var inquirer = require("inquirer");
var colors = require('colors/safe');
var Table = require('cli-table');

// SET COLOR THEMES FOR CONSOLE LOGS
colors.setTheme({
  inventory: ['yellow'],
  prompt: ['cyan', 'bold'],
  alert: ['red', 'bold'],
  total: ['green', 'bold'],
  info: ['red']
});

// DEFINE GLOABAL VARIABLES TO SIMPLIFY SCOPE ISSUES
var productSelectionID;
var productSelectionQty;

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

function printDepartment(res) { // INPUT: SQL QUERY RETURN  -  OUTPUT: DISPLAY LOG OF ITEM DETAILS
  var table = new Table({
    head: ['Dept. ID', 'Department', 'Overhead Costs', 'Product Sales', 'Total Profit'],
    colWidths: [10, 40, 20, 20, 20]
  });
  res.forEach((item) => {
    var total_profit = parseFloat(item['SUM(products.product_sales)'] - item.overhead_costs);
    table.push(
      [item.department_id, item.department_name, "$" + item.overhead_costs, "$"+item['SUM(products.product_sales)'], "$"+total_profit]
    )
  })
  console.log(table.toString());
};

function viewProductsSalesByDepartment() { // QUERY RETURN OF THE 2 TABLE DATA SETS
  var queryString = "SELECT departments.department_id, departments.department_name, departments.overhead_costs, " +
    "SUM(products.product_sales)\n" + 
    "FROM departments\n" +
    "INNER JOIN products ON departments.department_name=products.department_name\n" +
    "GROUP BY departments.department_id, departments.department_name, departments.overhead_costs;"
  connection.query(queryString, function (err, res) {
    if (err) throw err;
    console.log(res);
    printDepartment(res);
    setTimeout(supervisorInquiry, 1000);
  })
};

function supervisorInquiry() { // INQUIRER FUNCTION FOR PROGRAM OPTIONS
  console.log("\n----------------------------------------\n");
  inquirer.prompt([
    {
      type: "list",
      name: "supervisor_options",
      choices: [
        "View Product Sales by Department",
        "Create New Department",
      ]
    }
  ]).then(function (inputs) {
    console.log(inputs.supervisor_options);
    switch (inputs.supervisor_options) {
      case "View Product Sales by Department":
        viewProductsSalesByDepartment();
        break;
      case "Create New Department":
        createNewDepartment();
        break;
      default:
        break;
    }
  })
};

supervisorInquiry();