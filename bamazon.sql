DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
  id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(100) NOT NULL,
  price FLOAT(5,2),
  stock_quantity INT NOT NULL,
  PRIMARY KEY (id)
);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES("dog food", "pet supplies", 17.50, 12);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES("cat food", "pet supplies", 14.00, 15);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES("pajamas", "apparel", 21.25, 8);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES("parka", "apparel", 32.99, 10);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES("dungarees", "apparel", 45.59, 6);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES("air freshener", "car supplies", 3.99, 23);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES("wiper fluid", "car supplies", 8.75, 23);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES("tires", "car supplies", 118.75, 24);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES("top soil", "gardnening supplies", 18.75, 5);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES("hand spade", "gardnening supplies", 15.99, 5);