DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
  id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(100) NOT NULL,
  price FLOAT(5,2),
  stock_quantity INT NOT NULL,
  product_sales FLOAT(5,2),
  PRIMARY KEY (id)
);

INSERT INTO products(product_name, department_name, price, stock_quantity, product_sales)
VALUES("dog food", "pet supplies", 17.50, 12, 0);

INSERT INTO products(product_name, department_name, price, stock_quantity, product_sales)
VALUES("cat food", "pet supplies", 14.00, 15, 0);

INSERT INTO products(product_name, department_name, price, stock_quantity, product_sales)
VALUES("pajamas", "apparel", 21.25, 8, 0);

INSERT INTO products(product_name, department_name, price, stock_quantity, product_sales)
VALUES("parka", "apparel", 32.99, 10, 0);

INSERT INTO products(product_name, department_name, price, stock_quantity, product_sales)
VALUES("dungarees", "apparel", 45.59, 6, 0);

INSERT INTO products(product_name, department_name, price, stock_quantity, product_sales)
VALUES("air freshener", "car supplies", 3.99, 23, 0);

INSERT INTO products(product_name, department_name, price, stock_quantity, product_sales)
VALUES("wiper fluid", "car supplies", 8.75, 23, 0);

INSERT INTO products(product_name, department_name, price, stock_quantity, product_sales)
VALUES("tires", "car supplies", 118.75, 24, 0);

INSERT INTO products(product_name, department_name, price, stock_quantity, product_sales)
VALUES("top soil", "gardnening supplies", 18.75, 5, 0);

INSERT INTO products(product_name, department_name, price, stock_quantity, product_sales)
VALUES("hand spade", "gardnening supplies", 15.99, 5, 0);