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
  location VARCHAR(500),
  reg_date TIMESTAMP NOT NULL DEFAULT '0000-00-00 00:00:00',
  last_online TIMESTAMP NOT NULL DEFAULT '0000-00-00 00:00:00',
  profilepicture VARCHAR(100) DEFAULT 'default.png',
  coins INT(10) DEFAULT 0,
  admin BOOLEAN DEFAULT 0
);


CREATE TABLE friendship (
  id INT(6) PRIMARY KEY AUTO_INCREMENT NOT NULL,
  user1_id INT(6) NOT NULL,
  user2_id INT(6) NOT NULL,
  approved BOOLEAN DEFAULT 0,
  FOREIGN KEY (user1_id) REFERENCES user(id),
  FOREIGN KEY (user2_id) REFERENCES user(id)
);

CREATE TABLE product (
  id INT(6) PRIMARY KEY AUTO_INCREMENT NOT NULL,
  name VARCHAR(100) NOT NULL,
  price FLOAT(20) NOT NULL,
  description VARCHAR(500),
  image_url VARCHAR(500)
);

CREATE TABLE shoporder (
  id INT(6) PRIMARY KEY AUTO_INCREMENT NOT NULL,
  user_id INT(6) NOT NULL,
  ord_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
  image_url VARCHAR(500) NOT NULL,
  views INT(6) DEFAULT 0
);

CREATE TABLE hs_reaction (
  id INT(6) PRIMARY KEY AUTO_INCREMENT NOT NULL,
  highscore INT(11) NOT NULL,
  FOREIGN KEY (id) REFERENCES user(id)
);

CREATE TABLE hs_snake (
  id INT(6) PRIMARY KEY AUTO_INCREMENT NOT NULL,
  highscore INT(11) NOT NULL,
  FOREIGN KEY (id) REFERENCES user(id)
);

CREATE TABLE hs_flappy (
  id INT(6) PRIMARY KEY AUTO_INCREMENT NOT NULL,
  highscore INT(11) NOT NULL,
  FOREIGN KEY (id) REFERENCES user(id)
);

CREATE TABLE chatroom (
  id INT(10) PRIMARY KEY AUTO_INCREMENT NOT NULL,
  username VARCHAR(30) NOT NULL,
  msg VARCHAR(255) NOT NULL,
  ts TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO product (name, price, description, image_url) VALUES
("Tesla car", 9000000, "Super cool luxury car", "https://tctechcrunch2011.files.wordpress.com/2015/08/tesla_model_s.jpg?w=738"),
("Aliexpress giftcard", 5000, "20 dollar giftcard to Aliexpress!", "https://alixblog.com/wp-content/uploads/2015/02/Aliexpress-China.png"),
("Shower Cap", 400, "This shower cap will keep your hair dry!", "https://s-media-cache-ak0.pinimg.com/originals/f2/74/43/f27443c6ef7a2d6b3d7b4fbdc24da127.jpg"),
("Christmas Card", 50, "Merry Christmas!", "http://christmasgator.com/wp-content/uploads/2016/09/christmas-greeting-card-messages-for-teacher.jpg"),
("Coca-Cola Fridge", 2000, "A perfect Coca-Cola fridge to always keep a few Cokes cold for you!", "https://i5.walmartimages.com/asr/8be4f68d-4b73-4d7e-ae23-a885586a2761_1.a3c11afed43b10c584682428d033d94b.jpeg"),
("Zalando Giftcard", 10000, "Fashion for you! Get this 40 dollar giftcard to Zalando for only 10000 coins!", "https://pbs.twimg.com/profile_images/705724583794630656/Id7jmjPO.jpg");


INSERT INTO playandwin.chatroom (username, msg) VALUES ('guest', 'hello');

INSERT INTO user(username, firstname, lastname, email, password, coins, admin, reg_date, last_online)
VALUES('testi1', 'testi1', 'testi1', 'testi1@testi1.fi', '6dcf1cff0946426cc3bba390ad0f50d5', '4000', '0', '2017-03-06 10:04:34', '2017-03-06 10:04:34');

INSERT INTO user(username, firstname, lastname, email, password, coins, admin, reg_date, last_online)
VALUES('admin', 'admin', 'admin', 'admin@playandwin.fi', 'ec15d79e36e14dd258cfff3d48b73d35', '50000', '1', '2017-03-06 10:05:09', '2017-03-06 10:05:09');

INSERT INTO friendship (user1_id, user2_id, approved)
VALUES (1, 2, 1);
