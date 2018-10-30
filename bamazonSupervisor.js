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

// var table = new Table({
//     head: ['TH 1 label', 'TH 2 label']
//   , colWidths: [100, 200]
// });

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
    head: ['Department', 'Overhead Costs'],
    colWidths: [40, 20]
  });
  res.forEach((item) => {
    table.push(
      [item.department_name, item.overhead_costs]
    )
    // console.log(colors.inventory(

    //   "\n-------------\n" +
    //   "Department: " + toTitleCase(item.department_name) + "\n" +
    //   "Overhead Costs: $" + item.overhead_costs + "\n" +
    //   "\n--------------"
    // ));
  })
  console.log(table.toString());
};

function viewProductsSalesByDepartment() {
  connection.query("SELECT * FROM departments", function (err, res) {
    if (err) throw err;
    printDepartment(res);
  })
};

function supervisorInquiry() { // 
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

//   4. When a supervisor selects `View Product Sales by Department`, the app should display a summarized table in their terminal/bash window. Use the table below as a guide.

// | department_id | department_name | over_head_costs | product_sales | total_profit |
// | ------------- | --------------- | --------------- | ------------- | ------------ |
// | 01            | Electronics     | 10000           | 20000         | 10000        |
// | 02            | Clothing        | 60000           | 100000        | 40000        |

// 5. The `total_profit` column should be calculated on the fly using the difference between `over_head_costs` and `product_sales`. `total_profit` should not be stored in any database. You should use a custom alias.

// 6. If you can't get the table to display properly after a few hours, then feel free to go back and just add `total_profit` to the `departments` table.

//    * Hint: You may need to look into aliases in MySQL.

//    * Hint: You may need to look into GROUP BYs.

//    * Hint: You may need to look into JOINS.

//    * **HINT**: There may be an NPM package that can log the table to the console. What's is it? Good question :)
