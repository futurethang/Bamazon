USE bamazon_db;

CREATE TABLE departments (
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(100) NOT NULL,
  overhead_costs FLOAT(5,2) NOT NULL,
  PRIMARY KEY (id)
);

INSERT INTO departments(department_name, overhead_costs)
VALUES("pet supplies", 170);

INSERT INTO departments(department_name, overhead_costs)
VALUES("apparel", 320);

INSERT INTO departments(department_name, overhead_costs)
VALUES("car supplies", 1180);

INSERT INTO departments(department_name, overhead_costs)
VALUES("gardnening supplies", 10);