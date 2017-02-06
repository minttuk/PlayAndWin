CREATE DATABASE playandwin;

USE playandwin;

CREATE TABLE user (
  id INT(6) AUTO_INCREMENT PRIMARY KEY NOT NULL,
  username VARCHAR(30) NOT NULL,
  email VARCHAR(200) NOT NULL,
  password VARCHAR(200) NOT NULL,
  firstname VARCHAR(30),
  lastname VARCHAR(30),
  description VARCHAR(500),
  reg_date TIMESTAMP,
  coins INT(10) DEFAULT 0,
  admin BOOLEAN DEFAULT 0
);

CREATE TABLE friendship (
  user1_id INT(6) NOT NULL,
  user2_id INT(6) NOT NULL,
  approved BOOLEAN DEFAULT 0,
  CONSTRAINT friendship_id PRIMARY KEY (user1_id, user2_id),
  FOREIGN KEY (user1_id) REFERENCES user(id),
  FOREIGN KEY (user2_id) REFERENCES user(id)
);

CREATE TABLE product (
  id INT(6) PRIMARY KEY AUTO_INCREMENT NOT NULL,
  name VARCHAR(30) NOT NULL,
  price FLOAT(6) NOT NULL,
  description VARCHAR(500),
  image_url VARCHAR(50)
);

CREATE TABLE shoporder (
  id INT(6) PRIMARY KEY AUTO_INCREMENT NOT NULL,
  user_id INT(6) NOT NULL,
  ord_date DATETIME,
  FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE order_row (
  order_id INT(6) NOT NULL,
  product_id INT(6) NOT NULL,
  amount INT(6) NOT NULL,
  CONSTRAINT row_id PRIMARY KEY (order_id, product_id),
  FOREIGN KEY (order_id) REFERENCES shoporder(id),
  FOREIGN KEY (product_id) REFERENCES product(id)
);

CREATE TABLE advertisement (
  id INT(6) PRIMARY KEY AUTO_INCREMENT NOT NULL,
  company_name VARCHAR(100) NOT NULL,
  image_url VARCHAR(200) NOT NULL,
  views INT(6) DEFAULT 0
);
