# Bamazon
A retail shopping cart app built using Node.js and MySQL

## Node.js & MySQL

This project is a simple storefront using MySQL skills. The app takes in orders from customers and depletes stock from the store's inventory. Additional modules track product sales across the store's departments and then provide a summary of the highest-grossing departments in the store.

### Overview

Building upon Node.JS backend skills, the primary focus of this project was to setup and database and tables using MySQL and being able to reference and edit those entries from the Node terminal, using SQL queries and NPMs for functionality, UI and display. 

#### Module 1 - A Customer Portal. 

This iteration of the program allows a 'customer' to view the available products and related information, then choose a product and quantity for purchase. If the stock is available, the program shows a transaction total and then updates the database record's quantity and total product sales. If the item has too low of stock to fulfill the order, the user gets an error.

![bamazon_customer](https://user-images.githubusercontent.com/17099707/47896283-ff1e4780-de29-11e8-9ddd-9c5b9e77c5af.gif)

#### Module 2 - A Manager Portal. 

This iteration allows a 'manager' to view inventory management options for the item database. Based upon choice the user can view all the inventory items, view only items that have fallen below 5 in stock, add to the number in stock for an item, or create an all new product to be added to the database.

![bamazon supervisor](https://user-images.githubusercontent.com/17099707/47896284-ffb6de00-de29-11e8-8838-9f5649919b8e.gif)


#### Module 3 - A Supervisor Portal. 

At current this modules adds the ability of a user to view all of the product departments from a department database. The SQL query joins the tables to show total produc sales for that category and calculate the total profit genrated by that department. 

![bamazon manager](https://user-images.githubusercontent.com/17099707/47896285-ffb6de00-de29-11e8-920c-0e7762fd5ac9.gif)


## Challenges

As a learning exercise this assignment was excellent review and expansion of building an all Node.js application, with the added intricacies of database communication. Building out functioning SQL queries and packaging them into pleasing print-outs required trial and error and a lot of learning. I used some new NPM packages to display neat tables as well.