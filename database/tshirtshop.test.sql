-- Create tshirtshop tables

-- Create department table
CREATE TABLE `department` (
  `department_id` INT            NOT NULL  AUTO_INCREMENT,
  `name`          VARCHAR(100)   NOT NULL,
  `description`   VARCHAR(1000),
  PRIMARY KEY  (`department_id`)
) ENGINE=MyISAM;

-- Create category table
CREATE TABLE `category` (
  `category_id`   INT            NOT NULL  AUTO_INCREMENT,
  `department_id` INT            NOT NULL,
  `name`          VARCHAR(100)   NOT NULL,
  `description`   VARCHAR(1000),
  PRIMARY KEY (`category_id`),
  KEY `idx_category_department_id` (`department_id`)
) ENGINE=MyISAM;

-- Create product table
CREATE TABLE `product` (
  `product_id`       INT           NOT NULL  AUTO_INCREMENT,
  `name`             VARCHAR(100)  NOT NULL,
  `description`      VARCHAR(1000) NOT NULL,
  `price`            DECIMAL(10,2) NOT NULL,
  `discounted_price` DECIMAL(10,2) NOT NULL  DEFAULT '0.00',
  `image`            VARCHAR(150),
  `image_2`          VARCHAR(150),
  `thumbnail`        VARCHAR(150),
  `display`          SMALLINT(6)   NOT NULL  DEFAULT '0',
  PRIMARY KEY  (`product_id`),
  FULLTEXT KEY `idx_ft_product_name_description` (`name`, `description`)
) ENGINE=MyISAM;

-- Create product_category table
CREATE TABLE `product_category` (
  `product_id`  INT NOT NULL,
  `category_id` INT NOT NULL,
  PRIMARY KEY (`product_id`, `category_id`)
) ENGINE=MyISAM;

-- Create attribute table (stores attributes such as Size and Color)
CREATE TABLE `attribute` (
  `attribute_id` INT          NOT NULL  AUTO_INCREMENT,
  `name`         VARCHAR(100) NOT NULL, -- E.g. Color, Size
  PRIMARY KEY (`attribute_id`)
) ENGINE=MyISAM;


-- Create attribute_value table (stores values such as Yellow or XXL)
CREATE TABLE `attribute_value` (
  `attribute_value_id` INT          NOT NULL  AUTO_INCREMENT,
  `attribute_id`       INT          NOT NULL, -- The ID of the attribute
  `value`              VARCHAR(100) NOT NULL, -- E.g. Yellow
  PRIMARY KEY (`attribute_value_id`),
  KEY `idx_attribute_value_attribute_id` (`attribute_id`)
) ENGINE=MyISAM;

-- Create product_attribute table (associates attribute values to products)
CREATE TABLE `product_attribute` (
  `product_id`         INT NOT NULL,
  `attribute_value_id` INT NOT NULL,
  PRIMARY KEY (`product_id`, `attribute_value_id`)
) ENGINE=MyISAM;


-- Create shopping_cart table
CREATE TABLE `shopping_cart` (
  `item_id`     INT           NOT NULL  AUTO_INCREMENT,
  `cart_id`     CHAR(32)      NOT NULL,
  `product_id`  INT           NOT NULL,
  `attributes`  VARCHAR(1000) NOT NULL,
  `quantity`    INT           NOT NULL,
  `buy_now`     BOOL          NOT NULL  DEFAULT true,
  `added_on`    DATETIME      NOT NULL,
  PRIMARY KEY (`item_id`),
  KEY `idx_shopping_cart_cart_id` (`cart_id`)
) ENGINE=MyISAM;

-- Create orders table
CREATE TABLE `orders` (
  `order_id`     INT           NOT NULL  AUTO_INCREMENT,
  `total_amount` DECIMAL(10,2) NOT NULL  DEFAULT '0.00',
  `created_on`   DATETIME      NOT NULL,
  `shipped_on`   DATETIME,
  `status`       INT           NOT NULL  DEFAULT '0',
  `comments`     VARCHAR(255),
  `customer_id`  INT,
  `auth_code`    VARCHAR(50),
  `reference`    VARCHAR(50),
  `shipping_id`  INT,
  `tax_id`       INT,
  PRIMARY KEY  (`order_id`),
  KEY `idx_orders_customer_id` (`customer_id`),
  KEY `idx_orders_shipping_id` (`shipping_id`),
  KEY `idx_orders_tax_id` (`tax_id`)
) ENGINE=MyISAM;

-- Create order_details table
CREATE TABLE `order_detail` (
  `item_id`      INT           NOT NULL  AUTO_INCREMENT,
  `order_id`     INT           NOT NULL,
  `product_id`   INT           NOT NULL,
  `attributes`   VARCHAR(1000) NOT NULL,
  `product_name` VARCHAR(100)  NOT NULL,
  `quantity`     INT           NOT NULL,
  `unit_cost`    DECIMAL(10,2) NOT NULL,
  PRIMARY KEY  (`item_id`),
  KEY `idx_order_detail_order_id` (`order_id`)
) ENGINE=MyISAM;

-- Create shipping_region table
CREATE TABLE `shipping_region` (
  `shipping_region_id` INT          NOT NULL  AUTO_INCREMENT,
  `shipping_region`    VARCHAR(100) NOT NULL,
  PRIMARY KEY  (`shipping_region_id`)
) ENGINE=MyISAM;

-- Create customer table
CREATE TABLE `customer` (
  `customer_id`        INT           NOT NULL AUTO_INCREMENT,
  `name`               VARCHAR(50)   NOT NULL,
  `email`              VARCHAR(100)  NOT NULL,
  `password`           VARCHAR(50)   NOT NULL,
  `credit_card`        TEXT,
  `address_1`          VARCHAR(100),
  `address_2`          VARCHAR(100),
  `city`               VARCHAR(100),
  `region`             VARCHAR(100),
  `postal_code`        VARCHAR(100),
  `country`            VARCHAR(100),
  `shipping_region_id` INT           NOT NULL default '1',
  `day_phone`          varchar(100),
  `eve_phone`          varchar(100),
  `mob_phone`          varchar(100),
  PRIMARY KEY  (`customer_id`),
  UNIQUE KEY `idx_customer_email` (`email`),
  KEY `idx_customer_shipping_region_id` (`shipping_region_id`)
) ENGINE=MyISAM;

-- Create shipping table
CREATE TABLE `shipping` (
  `shipping_id`        INT            NOT NULL AUTO_INCREMENT,
  `shipping_type`      VARCHAR(100)   NOT NULL,
  `shipping_cost`      NUMERIC(10, 2) NOT NULL,
  `shipping_region_id` INT            NOT NULL,
  PRIMARY KEY (`shipping_id`),
  KEY `idx_shipping_shipping_region_id` (`shipping_region_id`)
) ENGINE=MyISAM;

-- Create tax table
CREATE TABLE `tax` (
  `tax_id`         INT            NOT NULL  AUTO_INCREMENT,
  `tax_type`       VARCHAR(100)   NOT NULL,
  `tax_percentage` NUMERIC(10, 2) NOT NULL,
  PRIMARY KEY (`tax_id`)
) ENGINE=MyISAM;

-- Create audit table
CREATE TABLE `audit` (
  `audit_id`       INT      NOT NULL AUTO_INCREMENT,
  `order_id`       INT      NOT NULL,
  `created_on`     DATETIME NOT NULL,
  `message`        TEXT     NOT NULL,
  `code`           INT      NOT NULL,
  PRIMARY KEY (`audit_id`),
  KEY `idx_audit_order_id` (`order_id`)
) ENGINE=MyISAM;

-- Create review table
CREATE TABLE `review` (
  `review_id`   INT      NOT NULL  AUTO_INCREMENT,
  `customer_id` INT      NOT NULL,
  `product_id`  INT      NOT NULL,
  `review`      TEXT     NOT NULL,
  `rating`      SMALLINT NOT NULL,
  `created_on`  DATETIME NOT NULL,
  PRIMARY KEY (`review_id`),
  KEY `idx_review_customer_id` (`customer_id`),
  KEY `idx_review_product_id` (`product_id`)
) ENGINE=MyISAM;

-- Change DELIMITER to $$
DELIMITER $$

-- Create catalog_get_departments_list stored procedure
CREATE PROCEDURE catalog_get_departments_list()
BEGIN
  SELECT department_id, name FROM department ORDER BY department_id;
END$$

-- Create catalog_get_department_details stored procedure
CREATE PROCEDURE catalog_get_department_details(IN inDepartmentId INT)
BEGIN
  SELECT name, description
  FROM   department
  WHERE  department_id = inDepartmentId;
END$$

-- Create catalog_get_categories_list stored procedure
CREATE PROCEDURE catalog_get_categories_list(IN inDepartmentId INT)
BEGIN
  SELECT   category_id, name
  FROM     category
  WHERE    department_id = inDepartmentId
  ORDER BY category_id;
END$$

-- Create catalog_get_category_details stored procedure
CREATE PROCEDURE catalog_get_category_details(IN inCategoryId INT)
BEGIN
  SELECT name, description
  FROM   category
  WHERE  category_id = inCategoryId;
END$$

-- Create catalog_count_products_in_category stored procedure
CREATE PROCEDURE catalog_count_products_in_category(IN inCategoryId INT)
BEGIN
  SELECT     COUNT(*) AS categories_count
  FROM       product p
  INNER JOIN product_category pc
               ON p.product_id = pc.product_id
  WHERE      pc.category_id = inCategoryId;
END$$

-- Create catalog_get_products_in_category stored procedure
CREATE PROCEDURE catalog_get_products_in_category(
  IN inCategoryId INT, IN inShortProductDescriptionLength INT,
  IN inProductsPerPage INT, IN inStartItem INT)
BEGIN
  -- Prepare statement
  PREPARE statement FROM
   "SELECT     p.product_id, p.name,
               IF(LENGTH(p.description) <= ?,
                  p.description,
                  CONCAT(LEFT(p.description, ?),
                         '...')) AS description,
               p.price, p.discounted_price, p.thumbnail
    FROM       product p
    INNER JOIN product_category pc
                 ON p.product_id = pc.product_id
    WHERE      pc.category_id = ?
    ORDER BY   p.display DESC
    LIMIT      ?, ?";

  -- Define query parameters
  SET @p1 = inShortProductDescriptionLength;
  SET @p2 = inShortProductDescriptionLength;
  SET @p3 = inCategoryId;
  SET @p4 = inStartItem;
  SET @p5 = inProductsPerPage;

  -- Execute the statement
  EXECUTE statement USING @p1, @p2, @p3, @p4, @p5;
END$$

-- Create catalog_count_products_on_department stored procedure
CREATE PROCEDURE catalog_count_products_on_department(IN inDepartmentId INT)
BEGIN
  SELECT DISTINCT COUNT(*) AS products_on_department_count
  FROM            product p
  INNER JOIN      product_category pc
                    ON p.product_id = pc.product_id
  INNER JOIN      category c
                    ON pc.category_id = c.category_id
  WHERE           (p.display = 2 OR p.display = 3)
                  AND c.department_id = inDepartmentId;
END$$

-- Create catalog_get_products_on_department stored procedure
CREATE PROCEDURE catalog_get_products_on_department(
  IN inDepartmentId INT, IN inShortProductDescriptionLength INT,
  IN inProductsPerPage INT, IN inStartItem INT)
BEGIN
  PREPARE statement FROM
    "SELECT DISTINCT p.product_id, p.name,
                     IF(LENGTH(p.description) <= ?,
                        p.description,
                        CONCAT(LEFT(p.description, ?),
                               '...')) AS description,
                     p.price, p.discounted_price, p.thumbnail
     FROM            product p
     INNER JOIN      product_category pc
                       ON p.product_id = pc.product_id
     INNER JOIN      category c
                       ON pc.category_id = c.category_id
     WHERE           (p.display = 2 OR p.display = 3)
                     AND c.department_id = ?
     ORDER BY        p.display DESC
     LIMIT           ?, ?";

  SET @p1 = inShortProductDescriptionLength;
  SET @p2 = inShortProductDescriptionLength;
  SET @p3 = inDepartmentId;
  SET @p4 = inStartItem;
  SET @p5 = inProductsPerPage;

  EXECUTE statement USING @p1, @p2, @p3, @p4, @p5;
END$$

-- Create catalog_count_products_on_catalog stored procedure
CREATE PROCEDURE catalog_count_products_on_catalog()
BEGIN
  SELECT COUNT(*) AS products_on_catalog_count
  FROM   product
  WHERE  display = 1 OR display = 3;
END$$

-- Create catalog_get_products_on_catalog stored procedure
CREATE PROCEDURE catalog_get_products_on_catalog(
  IN inShortProductDescriptionLength INT,
  IN inProductsPerPage INT, IN inStartItem INT)
BEGIN
  PREPARE statement FROM
    "SELECT   product_id, name,
              IF(LENGTH(description) <= ?,
                 description,
                 CONCAT(LEFT(description, ?),
                        '...')) AS description,
              price, discounted_price, thumbnail
     FROM     product
     WHERE    display = 1 OR display = 3
     ORDER BY display DESC
     LIMIT    ?, ?";

  SET @p1 = inShortProductDescriptionLength;
  SET @p2 = inShortProductDescriptionLength;
  SET @p3 = inStartItem;
  SET @p4 = inProductsPerPage;

  EXECUTE statement USING @p1, @p2, @p3, @p4;
END$$

-- Create catalog_get_product_details stored procedure
CREATE PROCEDURE catalog_get_product_details(IN inProductId INT)
BEGIN
  SELECT product_id, name, description,
         price, discounted_price, image, image_2
  FROM   product
  WHERE  product_id = inProductId;
END$$

-- Create catalog_get_product_locations stored procedure
CREATE PROCEDURE catalog_get_product_locations(IN inProductId INT)
BEGIN
  SELECT c.category_id, c.name AS category_name, c.department_id,
         (SELECT name
          FROM   department
          WHERE  department_id = c.department_id) AS department_name
          -- Subquery returns the name of the department of the category
  FROM   category c
  WHERE  c.category_id IN
           (SELECT category_id
            FROM   product_category
            WHERE  product_id = inProductId);
            -- Subquery returns the category IDs a product belongs to
END$$

-- Create catalog_get_product_attributes stored procedure
CREATE PROCEDURE catalog_get_product_attributes(IN inProductId INT)
BEGIN
  SELECT     a.name AS attribute_name,
             av.attribute_value_id, av.value AS attribute_value
  FROM       attribute_value av
  INNER JOIN attribute a
               ON av.attribute_id = a.attribute_id
  WHERE      av.attribute_value_id IN
               (SELECT attribute_value_id
                FROM   product_attribute
                WHERE  product_id = inProductId)
  ORDER BY   a.name;
END$$

-- Create catalog_get_department_name stored procedure
CREATE PROCEDURE catalog_get_department_name(IN inDepartmentId INT)
BEGIN
  SELECT name FROM department WHERE department_id = inDepartmentId;
END$$

-- Create catalog_get_category_name stored procedure
CREATE PROCEDURE catalog_get_category_name(IN inCategoryId INT)
BEGIN
  SELECT name FROM category WHERE category_id = inCategoryId;
END$$

-- Create catalog_get_product_name stored procedure
CREATE PROCEDURE catalog_get_product_name(IN inProductId INT)
BEGIN
  SELECT name FROM product WHERE product_id = inProductId;
END$$

-- Create catalog_count_search_result stored procedure
CREATE PROCEDURE catalog_count_search_result(
  IN inSearchString TEXT, IN inAllWords VARCHAR(3))
BEGIN
  IF inAllWords = "on" THEN
    PREPARE statement FROM
      "SELECT   count(*)
       FROM     product
       WHERE    MATCH (name, description) AGAINST (? IN BOOLEAN MODE)";
  ELSE
    PREPARE statement FROM
      "SELECT   count(*)
       FROM     product
       WHERE    MATCH (name, description) AGAINST (?)";
  END IF;

  SET @p1 = inSearchString;

  EXECUTE statement USING @p1;
END$$

-- Create catalog_search stored procedure
CREATE PROCEDURE catalog_search(
  IN inSearchString TEXT, IN inAllWords VARCHAR(3),
  IN inShortProductDescriptionLength INT,
  IN inProductsPerPage INT, IN inStartItem INT)
BEGIN
  IF inAllWords = "on" THEN
    PREPARE statement FROM
      "SELECT   product_id, name,
                IF(LENGTH(description) <= ?,
                   description,
                   CONCAT(LEFT(description, ?),
                          '...')) AS description,
                price, discounted_price, thumbnail
       FROM     product
       WHERE    MATCH (name, description)
                AGAINST (? IN BOOLEAN MODE)
       ORDER BY MATCH (name, description)
                AGAINST (? IN BOOLEAN MODE) DESC
       LIMIT    ?, ?";
  ELSE
    PREPARE statement FROM
      "SELECT   product_id, name,
                IF(LENGTH(description) <= ?,
                   description,
                   CONCAT(LEFT(description, ?),
                          '...')) AS description,
                price, discounted_price, thumbnail
       FROM     product
       WHERE    MATCH (name, description) AGAINST (?)
       ORDER BY MATCH (name, description) AGAINST (?) DESC
       LIMIT    ?, ?";
  END IF;

  SET @p1 = inShortProductDescriptionLength;
  SET @p2 = inSearchString;
  SET @p3 = inStartItem;
  SET @p4 = inProductsPerPage;

  EXECUTE statement USING @p1, @p1, @p2, @p2, @p3, @p4;
END$$

-- Create catalog_get_departments stored procedure
CREATE PROCEDURE catalog_get_departments()
BEGIN
  SELECT   department_id, name, description
  FROM     department
  ORDER BY department_id;
END$$

-- Create catalog_add_department stored procedure
CREATE PROCEDURE catalog_add_department(
  IN inName VARCHAR(100), IN inDescription VARCHAR(1000))
BEGIN
  INSERT INTO department (name, description)
         VALUES (inName, inDescription);
END$$

-- Create catalog_update_department stored procedure
CREATE PROCEDURE catalog_update_department(IN inDepartmentId INT,
  IN inName VARCHAR(100), IN inDescription VARCHAR(1000))
BEGIN
  UPDATE department
  SET    name = inName, description = inDescription
  WHERE  department_id = inDepartmentId;
END$$

-- Create catalog_delete_department stored procedure
CREATE PROCEDURE catalog_delete_department(IN inDepartmentId INT)
BEGIN
  DECLARE categoryRowsCount INT;

  SELECT count(*)
  FROM   category
  WHERE  department_id = inDepartmentId
  INTO   categoryRowsCount;

  IF categoryRowsCount = 0 THEN
    DELETE FROM department WHERE department_id = inDepartmentId;

    SELECT 1;
  ELSE
    SELECT -1;
  END IF;
END$$

-- Create catalog_get_department_categories stored procedure
CREATE PROCEDURE catalog_get_department_categories(IN inDepartmentId INT)
BEGIN
  SELECT   category_id, name, description
  FROM     category
  WHERE    department_id = inDepartmentId
  ORDER BY category_id;
END$$

-- Create catalog_add_category stored procedure
CREATE PROCEDURE catalog_add_category(IN inDepartmentId INT,
  IN inName VARCHAR(100), IN inDescription VARCHAR(1000))
BEGIN
  INSERT INTO category (department_id, name, description)
         VALUES (inDepartmentId, inName, inDescription);
END$$

-- Create catalog_update_category stored procedure
CREATE PROCEDURE catalog_update_category(IN inCategoryId INT,
  IN inName VARCHAR(100), IN inDescription VARCHAR(1000))
BEGIN
    UPDATE category
    SET    name = inName, description = inDescription
    WHERE  category_id = inCategoryId;
END$$

-- Create catalog_delete_category stored procedure
CREATE PROCEDURE catalog_delete_category(IN inCategoryId INT)
BEGIN
  DECLARE productCategoryRowsCount INT;

  SELECT      count(*)
  FROM        product p
  INNER JOIN  product_category pc
                ON p.product_id = pc.product_id
  WHERE       pc.category_id = inCategoryId
  INTO        productCategoryRowsCount;

  IF productCategoryRowsCount = 0 THEN
    DELETE FROM category WHERE category_id = inCategoryId;

    SELECT 1;
  ELSE
    SELECT -1;
  END IF;
END$$

-- Create catalog_get_attributes stored procedure
CREATE PROCEDURE catalog_get_attributes()
BEGIN
  SELECT attribute_id, name FROM attribute ORDER BY attribute_id;
END$$

-- Create catalog_add_attribute stored procedure
CREATE PROCEDURE catalog_add_attribute(IN inName VARCHAR(100))
BEGIN
  INSERT INTO attribute (name) VALUES (inName);
END$$

-- Create catalog_update_attribute stored procedure
CREATE PROCEDURE catalog_update_attribute(
  IN inAttributeId INT, IN inName VARCHAR(100))
BEGIN
  UPDATE attribute SET name = inName WHERE attribute_id = inAttributeId;
END$$

-- Create catalog_delete_attribute stored procedure
CREATE PROCEDURE catalog_delete_attribute(IN inAttributeId INT)
BEGIN
  DECLARE attributeRowsCount INT;

  SELECT count(*)
  FROM   attribute_value
  WHERE  attribute_id = inAttributeId
  INTO   attributeRowsCount;

  IF attributeRowsCount = 0 THEN
    DELETE FROM attribute WHERE attribute_id = inAttributeId;

    SELECT 1;
  ELSE
    SELECT -1;
  END IF;
END$$

-- Create catalog_get_attribute_details stored procedure
CREATE PROCEDURE catalog_get_attribute_details(IN inAttributeId INT)
BEGIN
  SELECT attribute_id, name
  FROM   attribute
  WHERE  attribute_id = inAttributeId;
END$$

-- Create catalog_get_attribute_values stored procedure
CREATE PROCEDURE catalog_get_attribute_values(IN inAttributeId INT)
BEGIN
  SELECT   attribute_value_id, value
  FROM     attribute_value
  WHERE    attribute_id = inAttributeId
  ORDER BY attribute_id;
END$$

-- Create catalog_add_attribute_value stored procedure
CREATE PROCEDURE catalog_add_attribute_value(
  IN inAttributeId INT, IN inValue VARCHAR(100))
BEGIN
  INSERT INTO attribute_value (attribute_id, value)
         VALUES (inAttributeId, inValue);
END$$

-- Create catalog_update_attribute_value stored procedure
CREATE PROCEDURE catalog_update_attribute_value(
  IN inAttributeValueId INT, IN inValue VARCHAR(100))
BEGIN
    UPDATE attribute_value
    SET    value = inValue
    WHERE  attribute_value_id = inAttributeValueId;
END$$

-- Create catalog_delete_attribute_value stored procedure
CREATE PROCEDURE catalog_delete_attribute_value(IN inAttributeValueId INT)
BEGIN
  DECLARE productAttributeRowsCount INT;

  SELECT      count(*)
  FROM        product p
  INNER JOIN  product_attribute pa
                ON p.product_id = pa.product_id
  WHERE       pa.attribute_value_id = inAttributeValueId
  INTO        productAttributeRowsCount;

  IF productAttributeRowsCount = 0 THEN
    DELETE FROM attribute_value WHERE attribute_value_id = inAttributeValueId;

    SELECT 1;
  ELSE
    SELECT -1;
  END IF;
END$$

-- Create catalog_get_category_products stored procedure
CREATE PROCEDURE catalog_get_category_products(IN inCategoryId INT)
BEGIN
  SELECT     p.product_id, p.name, p.description, p.price,
             p.discounted_price
  FROM       product p
  INNER JOIN product_category pc
               ON p.product_id = pc.product_id
  WHERE      pc.category_id = inCategoryId
  ORDER BY   p.product_id;
END$$

-- Create catalog_add_product_to_category stored procedure
CREATE PROCEDURE catalog_add_product_to_category(IN inCategoryId INT,
  IN inName VARCHAR(100), IN inDescription VARCHAR(1000),
  IN inPrice DECIMAL(10, 2))
BEGIN
  DECLARE productLastInsertId INT;

  INSERT INTO product (name, description, price)
         VALUES (inName, inDescription, inPrice);

  SELECT LAST_INSERT_ID() INTO productLastInsertId;

  INSERT INTO product_category (product_id, category_id)
         VALUES (productLastInsertId, inCategoryId);
END$$

-- Create catalog_update_product stored procedure
CREATE PROCEDURE catalog_update_product(IN inProductId INT,
  IN inName VARCHAR(100), IN inDescription VARCHAR(1000),
  IN inPrice DECIMAL(10, 2), IN inDiscountedPrice DECIMAL(10, 2))
BEGIN
  UPDATE product
  SET    name = inName, description = inDescription, price = inPrice,
         discounted_price = inDiscountedPrice
  WHERE  product_id = inProductId;
END$$

-- Create catalog_remove_product_from_category stored procedure
CREATE PROCEDURE catalog_remove_product_from_category(
  IN inProductId INT, IN inCategoryId INT)
BEGIN
  DECLARE productCategoryRowsCount INT;

  SELECT count(*)
  FROM   product_category
  WHERE  product_id = inProductId
  INTO   productCategoryRowsCount;

  IF productCategoryRowsCount = 1 THEN
    CALL catalog_delete_product(inProductId);

    SELECT 0;
  ELSE
    DELETE FROM product_category
    WHERE  category_id = inCategoryId AND product_id = inProductId;

    SELECT 1;
  END IF;
END$$

-- Create catalog_get_categories stored procedure
CREATE PROCEDURE catalog_get_categories()
BEGIN
  SELECT   category_id, name, description
  FROM     category
  ORDER BY category_id;
END$$

-- Create catalog_get_product_info stored procedure
CREATE PROCEDURE catalog_get_product_info(IN inProductId INT)
BEGIN
  SELECT product_id, name, description, price, discounted_price,
         image, image_2, thumbnail, display
  FROM   product
  WHERE  product_id = inProductId;
END$$

-- Create catalog_get_categories_for_product stored procedure
CREATE PROCEDURE catalog_get_categories_for_product(IN inProductId INT)
BEGIN
  SELECT   c.category_id, c.department_id, c.name
  FROM     category c
  JOIN     product_category pc
             ON c.category_id = pc.category_id
  WHERE    pc.product_id = inProductId
  ORDER BY category_id;
END$$

-- Create catalog_set_product_display_option stored procedure
CREATE PROCEDURE catalog_set_product_display_option(
  IN inProductId INT, IN inDisplay SMALLINT)
BEGIN
  UPDATE product SET display = inDisplay WHERE product_id = inProductId;
END$$

-- Create catalog_assign_product_to_category stored procedure
CREATE PROCEDURE catalog_assign_product_to_category(
  IN inProductId INT, IN inCategoryId INT)
BEGIN
  INSERT INTO product_category (product_id, category_id)
         VALUES (inProductId, inCategoryId);
END$$

-- Create catalog_move_product_to_category stored procedure
CREATE PROCEDURE catalog_move_product_to_category(IN inProductId INT,
  IN inSourceCategoryId INT, IN inTargetCategoryId INT)
BEGIN
  UPDATE product_category
  SET    category_id = inTargetCategoryId
  WHERE  product_id = inProductId
         AND category_id = inSourceCategoryId;
END$$

-- Create catalog_get_attributes_not_assigned_to_product stored procedure
CREATE PROCEDURE catalog_get_attributes_not_assigned_to_product(
  IN inProductId INT)
BEGIN
  SELECT     a.name AS attribute_name,
             av.attribute_value_id, av.value AS attribute_value
  FROM       attribute_value av
  INNER JOIN attribute a
               ON av.attribute_id = a.attribute_id
  WHERE      av.attribute_value_id NOT IN
             (SELECT attribute_value_id
              FROM   product_attribute
              WHERE  product_id = inProductId)
  ORDER BY   attribute_name, av.attribute_value_id;
END$$

-- Create catalog_assign_attribute_value_to_product stored procedure
CREATE PROCEDURE catalog_assign_attribute_value_to_product(
  IN inProductId INT, IN inAttributeValueId INT)
BEGIN
  INSERT INTO product_attribute (product_id, attribute_value_id)
         VALUES (inProductId, inAttributeValueId);
END$$

-- Create catalog_remove_product_attribute_value stored procedure
CREATE PROCEDURE catalog_remove_product_attribute_value(
  IN inProductId INT, IN inAttributeValueId INT)
BEGIN
  DELETE FROM product_attribute
  WHERE       product_id = inProductId AND
              attribute_value_id = inAttributeValueId;
END$$

-- Create catalog_set_image stored procedure
CREATE PROCEDURE catalog_set_image(
  IN inProductId INT, IN inImage VARCHAR(150))
BEGIN
  UPDATE product SET image = inImage WHERE product_id = inProductId;
END$$

-- Create catalog_set_image_2 stored procedure
CREATE PROCEDURE catalog_set_image_2(
  IN inProductId INT, IN inImage VARCHAR(150))
BEGIN
  UPDATE product SET image_2 = inImage WHERE product_id = inProductId;
END$$

-- Create catalog_set_thumbnail stored procedure
CREATE PROCEDURE catalog_set_thumbnail(
  IN inProductId INT, IN inThumbnail VARCHAR(150))
BEGIN
  UPDATE product
  SET    thumbnail = inThumbnail
  WHERE  product_id = inProductId;
END$$

-- Create shopping_cart_add_product stored procedure
CREATE PROCEDURE shopping_cart_add_product(IN inCartId CHAR(32),
  IN inProductId INT, IN inAttributes VARCHAR(1000))
BEGIN
  DECLARE productQuantity INT;

  -- Obtain current shopping cart quantity for the product
  SELECT quantity
  FROM   shopping_cart
  WHERE  cart_id = inCartId
         AND product_id = inProductId
         AND attributes = inAttributes
  INTO   productQuantity;

  -- Create new shopping cart record, or increase quantity of existing record
  IF productQuantity IS NULL THEN
    INSERT INTO shopping_cart(item_id, cart_id, product_id, attributes,
                              quantity, added_on)
           VALUES (UUID(), inCartId, inProductId, inAttributes, 1, NOW());
  ELSE
    UPDATE shopping_cart
    SET    quantity = quantity + 1, buy_now = true
    WHERE  cart_id = inCartId
           AND product_id = inProductId
           AND attributes = inAttributes;
  END IF;
END$$

-- Create shopping_cart_update_product stored procedure
CREATE PROCEDURE shopping_cart_update(IN inItemId INT, IN inQuantity INT)
BEGIN
  IF inQuantity > 0 THEN
    UPDATE shopping_cart
    SET    quantity = inQuantity, added_on = NOW()
    WHERE  item_id = inItemId;
  ELSE
    CALL shopping_cart_remove_product(inItemId);
  END IF;
END$$

-- Create shopping_cart_remove_product stored procedure
CREATE PROCEDURE shopping_cart_remove_product(IN inItemId INT)
BEGIN
  DELETE FROM shopping_cart WHERE item_id = inItemId;
END$$

-- Create shopping_cart_get_products stored procedure
CREATE PROCEDURE shopping_cart_get_products(IN inCartId CHAR(32))
BEGIN
  SELECT     sc.item_id, p.name, sc.attributes,
             COALESCE(NULLIF(p.discounted_price, 0), p.price) AS price,
             sc.quantity,
             COALESCE(NULLIF(p.discounted_price, 0),
                      p.price) * sc.quantity AS subtotal
  FROM       shopping_cart sc
  INNER JOIN product p
               ON sc.product_id = p.product_id
  WHERE      sc.cart_id = inCartId AND sc.buy_now;
END$$

-- Create shopping_cart_get_saved_products stored procedure
CREATE PROCEDURE shopping_cart_get_saved_products(IN inCartId CHAR(32))
BEGIN
  SELECT     sc.item_id, p.name, sc.attributes,
             COALESCE(NULLIF(p.discounted_price, 0), p.price) AS price
  FROM       shopping_cart sc
  INNER JOIN product p
               ON sc.product_id = p.product_id
  WHERE      sc.cart_id = inCartId AND NOT sc.buy_now;
END$$

-- Create shopping_cart_get_total_amount stored procedure
CREATE PROCEDURE shopping_cart_get_total_amount(IN inCartId CHAR(32))
BEGIN
  SELECT     SUM(COALESCE(NULLIF(p.discounted_price, 0), p.price)
                 * sc.quantity) AS total_amount
  FROM       shopping_cart sc
  INNER JOIN product p
               ON sc.product_id = p.product_id
  WHERE      sc.cart_id = inCartId AND sc.buy_now;
END$$

-- Create shopping_cart_save_product_for_later stored procedure
CREATE PROCEDURE shopping_cart_save_product_for_later(IN inItemId INT)
BEGIN
  UPDATE shopping_cart
  SET    buy_now = false, quantity = 1
  WHERE  item_id = inItemId;
END$$

-- Create shopping_cart_move_product_to_cart stored procedure
CREATE PROCEDURE shopping_cart_move_product_to_cart(IN inItemId INT)
BEGIN
  UPDATE shopping_cart
  SET    buy_now = true, added_on = NOW()
  WHERE  item_id = inItemId;
END$$

-- Create catalog_delete_product stored procedure
CREATE PROCEDURE catalog_delete_product(IN inProductId INT)
BEGIN
  DELETE FROM product_attribute WHERE product_id = inProductId;
  DELETE FROM product_category WHERE product_id = inProductId;
  DELETE FROM shopping_cart WHERE product_id = inProductId;
  DELETE FROM product WHERE product_id = inProductId;
END$$

-- Create shopping_cart_count_old_carts stored procedure
CREATE PROCEDURE shopping_cart_count_old_carts(IN inDays INT)
BEGIN
  SELECT COUNT(cart_id) AS old_shopping_carts_count
  FROM   (SELECT   cart_id
          FROM     shopping_cart
          GROUP BY cart_id
          HAVING   DATE_SUB(NOW(), INTERVAL inDays DAY) >= MAX(added_on))
         AS old_carts;
END$$

-- Create shopping_cart_delete_old_carts stored procedure
CREATE PROCEDURE shopping_cart_delete_old_carts(IN inDays INT)
BEGIN
  DELETE FROM shopping_cart
  WHERE  cart_id IN
          (SELECT cart_id
           FROM   (SELECT   cart_id
                   FROM     shopping_cart
                   GROUP BY cart_id
                   HAVING   DATE_SUB(NOW(), INTERVAL inDays DAY) >=
                            MAX(added_on))
                  AS sc);
END$$

-- Create shopping_cart_empty stored procedure
CREATE PROCEDURE shopping_cart_empty(IN inCartId CHAR(32))
BEGIN
  DELETE FROM shopping_cart WHERE cart_id = inCartId;
END$$

-- Create orders_get_order_details stored procedure
CREATE PROCEDURE orders_get_order_details(IN inOrderId INT)
BEGIN
  SELECT order_id, product_id, attributes, product_name,
         quantity, unit_cost, (quantity * unit_cost) AS subtotal
  FROM   order_detail
  WHERE  order_id = inOrderId;
END$$

-- Create catalog_get_recommendations stored procedure
CREATE PROCEDURE catalog_get_recommendations(
  IN inProductId INT, IN inShortProductDescriptionLength INT)
BEGIN
  PREPARE statement FROM
    "SELECT   od2.product_id, od2.product_name,
              IF(LENGTH(p.description) <= ?, p.description,
                 CONCAT(LEFT(p.description, ?), '...')) AS description
     FROM     order_detail od1
     JOIN     order_detail od2 ON od1.order_id = od2.order_id
     JOIN     product p ON od2.product_id = p.product_id
     WHERE    od1.product_id = ? AND
              od2.product_id != ?
     GROUP BY od2.product_id
     ORDER BY COUNT(od2.product_id) DESC
     LIMIT 5";

  SET @p1 = inShortProductDescriptionLength;
  SET @p2 = inProductId;

  EXECUTE statement USING @p1, @p1, @p2, @p2;
END$$

-- Create shopping_cart_get_recommendations stored procedure
CREATE PROCEDURE shopping_cart_get_recommendations(
  IN inCartId CHAR(32), IN inShortProductDescriptionLength INT)
BEGIN
  PREPARE statement FROM
    "-- Returns the products that exist in a list of orders
     SELECT   od1.product_id, od1.product_name,
              IF(LENGTH(p.description) <= ?, p.description,
                 CONCAT(LEFT(p.description, ?), '...')) AS description
     FROM     order_detail od1
     JOIN     order_detail od2
                ON od1.order_id = od2.order_id
     JOIN     product p
                ON od1.product_id = p.product_id
     JOIN     shopping_cart
                ON od2.product_id = shopping_cart.product_id
     WHERE    shopping_cart.cart_id = ?
              -- Must not include products that already exist
              -- in the visitor's cart
              AND od1.product_id NOT IN
              (-- Returns the products in the specified
               -- shopping cart
               SELECT product_id
               FROM   shopping_cart
               WHERE  cart_id = ?)
     -- Group the product_id so we can calculate the rank
     GROUP BY od1.product_id
     -- Order descending by rank
     ORDER BY COUNT(od1.product_id) DESC
     LIMIT    5";

  SET @p1 = inShortProductDescriptionLength;
  SET @p2 = inCartId;

  EXECUTE statement USING @p1, @p1, @p2, @p2;
END$$

-- Create customer_get_login_info stored procedure
CREATE PROCEDURE customer_get_login_info(IN inEmail VARCHAR(100))
BEGIN
  SELECT customer_id, password FROM customer WHERE email = inEmail;
END$$

-- Create customer_add stored procedure
CREATE PROCEDURE customer_add(IN inName VARCHAR(50),
  IN inEmail VARCHAR(100), IN inPassword VARCHAR(50))
BEGIN
  INSERT INTO customer (name, email, password)
         VALUES (inName, inEmail, inPassword);

  SELECT LAST_INSERT_ID();
END$$

-- Create customer_get_customer stored procedure
CREATE PROCEDURE customer_get_customer(IN inCustomerId INT)
BEGIN
  SELECT customer_id, name, email, password, credit_card,
         address_1, address_2, city, region, postal_code, country,
         shipping_region_id, day_phone, eve_phone, mob_phone
  FROM   customer
  WHERE  customer_id = inCustomerId;
END$$

-- Create customer_update_account stored procedure
CREATE PROCEDURE customer_update_account(IN inCustomerId INT,
  IN inName VARCHAR(50), IN inEmail VARCHAR(100),
  IN inPassword VARCHAR(50), IN inDayPhone VARCHAR(100),
  IN inEvePhone VARCHAR(100), IN inMobPhone VARCHAR(100))
BEGIN
  UPDATE customer
  SET    name = inName, email = inEmail,
         password = inPassword, day_phone = inDayPhone,
         eve_phone = inEvePhone, mob_phone = inMobPhone
  WHERE  customer_id = inCustomerId;
END$$

-- Create customer_update_credit_card stored procedure
CREATE PROCEDURE customer_update_credit_card(
  IN inCustomerId INT, IN inCreditCard TEXT)
BEGIN
  UPDATE customer
  SET    credit_card = inCreditCard
  WHERE  customer_id = inCustomerId;
END$$

-- Create customer_get_shipping_regions stored procedure
CREATE PROCEDURE customer_get_shipping_regions()
BEGIN
  SELECT shipping_region_id, shipping_region FROM shipping_region;
END$$

-- Create customer_update_address stored procedure
CREATE PROCEDURE customer_update_address(IN inCustomerId INT,
  IN inAddress1 VARCHAR(100), IN inAddress2 VARCHAR(100),
  IN inCity VARCHAR(100), IN inRegion VARCHAR(100),
  IN inPostalCode VARCHAR(100), IN inCountry VARCHAR(100),
  IN inShippingRegionId INT)
BEGIN
  UPDATE customer
  SET    address_1 = inAddress1, address_2 = inAddress2, city = inCity,
         region = inRegion, postal_code = inPostalCode,
         country = inCountry, shipping_region_id = inShippingRegionId
  WHERE  customer_id = inCustomerId;
END$$

-- Create orders_get_most_recent_orders stored procedure
CREATE PROCEDURE orders_get_most_recent_orders(IN inHowMany INT)
BEGIN
  PREPARE statement FROM
    "SELECT     o.order_id, o.total_amount, o.created_on,
                o.shipped_on, o.status, c.name
     FROM       orders o
     INNER JOIN customer c
                  ON o.customer_id = c.customer_id
     ORDER BY   o.created_on DESC
     LIMIT      ?";

  SET @p1 = inHowMany;

  EXECUTE statement USING @p1;
END$$

-- Create orders_get_orders_between_dates stored procedure
CREATE PROCEDURE orders_get_orders_between_dates(
  IN inStartDate DATETIME, IN inEndDate DATETIME)
BEGIN
  SELECT     o.order_id, o.total_amount, o.created_on,
             o.shipped_on, o.status, c.name
  FROM       orders o
  INNER JOIN customer c
               ON o.customer_id = c.customer_id
  WHERE      o.created_on >= inStartDate AND o.created_on <= inEndDate
  ORDER BY   o.created_on DESC;
END$$

-- Create orders_get_orders_by_status stored procedure
CREATE PROCEDURE orders_get_orders_by_status(IN inStatus INT)
BEGIN
  SELECT     o.order_id, o.total_amount, o.created_on,
             o.shipped_on, o.status, c.name
  FROM       orders o
  INNER JOIN customer c
               ON o.customer_id = c.customer_id
  WHERE      o.status = inStatus
  ORDER BY   o.created_on DESC;
END$$

-- Create orders_get_by_customer_id stored procedure
CREATE PROCEDURE orders_get_by_customer_id(IN inCustomerId INT)
BEGIN
  SELECT     o.order_id, o.total_amount, o.created_on,
             o.shipped_on, o.status, c.name
  FROM       orders o
  INNER JOIN customer c
               ON o.customer_id = c.customer_id
  WHERE      o.customer_id = inCustomerId
  ORDER BY   o.created_on DESC;
END$$

-- Create orders_get_order_short_details stored procedure
CREATE PROCEDURE orders_get_order_short_details(IN inOrderId INT)
BEGIN
  SELECT      o.order_id, o.total_amount, o.created_on,
              o.shipped_on, o.status, c.name
  FROM        orders o
  INNER JOIN  customer c
                ON o.customer_id = c.customer_id
  WHERE       o.order_id = inOrderId;
END$$

-- Create customer_get_customers_list stored procedure
CREATE PROCEDURE customer_get_customers_list()
BEGIN
  SELECT customer_id, name FROM customer ORDER BY name ASC;
END$$

-- Create shopping_cart_create_order stored procedure
CREATE PROCEDURE shopping_cart_create_order(IN inCartId CHAR(32),
  IN inCustomerId INT, IN inShippingId INT, IN inTaxId INT)
BEGIN
  DECLARE orderId INT;

  -- Insert a new record into orders and obtain the new order ID
  INSERT INTO orders (created_on, customer_id, shipping_id, tax_id) VALUES
         (NOW(), inCustomerId, inShippingId, inTaxId);
  -- Obtain the new Order ID
  SELECT LAST_INSERT_ID() INTO orderId;

  -- Insert order details in order_detail table
  INSERT INTO order_detail (order_id, product_id, attributes,
                            product_name, quantity, unit_cost)
  SELECT      orderId, p.product_id, sc.attributes, p.name, sc.quantity,
              COALESCE(NULLIF(p.discounted_price, 0), p.price) AS unit_cost
  FROM        shopping_cart sc
  INNER JOIN  product p
                ON sc.product_id = p.product_id
  WHERE       sc.cart_id = inCartId AND sc.buy_now;

  -- Save the order's total amount
  UPDATE orders
  SET    total_amount = (SELECT SUM(unit_cost * quantity)
                         FROM   order_detail
                         WHERE  order_id = orderId)
  WHERE  order_id = orderId;

  -- Clear the shopping cart
  CALL shopping_cart_empty(inCartId);

  -- Return the Order ID
  SELECT orderId;
END$$

-- Create orders_get_order_info stored procedure
CREATE PROCEDURE orders_get_order_info(IN inOrderId INT)
BEGIN
  SELECT     o.order_id, o.total_amount, o.created_on, o.shipped_on,
             o.status, o.comments, o.customer_id, o.auth_code,
             o.reference, o.shipping_id, s.shipping_type, s.shipping_cost,
             o.tax_id, t.tax_type, t.tax_percentage
  FROM       orders o
  INNER JOIN tax t
               ON t.tax_id = o.tax_id
  INNER JOIN shipping s
               ON s.shipping_id = o.shipping_id
  WHERE      o.order_id = inOrderId;
END$$

-- Create orders_get_shipping_info stored procedure
CREATE PROCEDURE orders_get_shipping_info(IN inShippingRegionId INT)
BEGIN
  SELECT shipping_id, shipping_type, shipping_cost, shipping_region_id
  FROM   shipping
  WHERE  shipping_region_id = inShippingRegionId;
END$$

-- Create orders_create_audit stored procedure
CREATE PROCEDURE orders_create_audit(IN inOrderId INT,
  IN inMessage TEXT, IN inCode INT)
BEGIN
  INSERT INTO audit (order_id, created_on, message, code)
         VALUES (inOrderId, NOW(), inMessage, inCode);
END$$

-- Create orders_update_status stored procedure
CREATE PROCEDURE orders_update_status(IN inOrderId INT, IN inStatus INT)
BEGIN
  UPDATE orders SET status = inStatus WHERE order_id = inOrderId;
END$$

-- Create orders_set_auth_code stored procedure
CREATE PROCEDURE orders_set_auth_code(IN inOrderId INT,
  IN inAuthCode VARCHAR(50), IN inReference VARCHAR(50))
BEGIN
  UPDATE orders
  SET    auth_code = inAuthCode, reference = inReference
  WHERE  order_id = inOrderId;
END$$

-- Create orders_set_date_shipped stored procedure
CREATE PROCEDURE orders_set_date_shipped(IN inOrderId INT)
BEGIN
  UPDATE orders SET shipped_on = NOW() WHERE order_id = inOrderId;
END$$

-- Create orders_update_order stored procedure
CREATE PROCEDURE orders_update_order(IN inOrderId INT, IN inStatus INT,
  IN inComments VARCHAR(255), IN inAuthCode VARCHAR(50),
  IN inReference VARCHAR(50))
BEGIN
  DECLARE currentDateShipped DATETIME;

  SELECT shipped_on
  FROM   orders
  WHERE  order_id = inOrderId
  INTO   currentDateShipped;

  UPDATE orders
  SET    status = inStatus, comments = inComments,
         auth_code = inAuthCode, reference = inReference
  WHERE  order_id = inOrderId;

  IF inStatus < 7 AND currentDateShipped IS NOT NULL THEN
    UPDATE orders SET shipped_on = NULL WHERE order_id = inOrderId;
  ELSEIF inStatus > 6 AND currentDateShipped IS NULL THEN
    UPDATE orders SET shipped_on = NOW() WHERE order_id = inOrderId;
  END IF;
END$$

-- Create orders_get_audit_trail stored procedure
CREATE PROCEDURE orders_get_audit_trail(IN inOrderId INT)
BEGIN
  SELECT audit_id, order_id, created_on, message, code
  FROM   audit
  WHERE  order_id = inOrderId;
END$$

-- Create catalog_get_product_reviews stored procedure
CREATE PROCEDURE catalog_get_product_reviews(IN inProductId INT)
BEGIN
  SELECT     c.name, r.review, r.rating, r.created_on
  FROM       review r
  INNER JOIN customer c
               ON c.customer_id = r.customer_id
  WHERE      r.product_id = inProductId
  ORDER BY   r.created_on DESC;
END$$

-- Create catalog_create_product_review stored procedure
CREATE PROCEDURE catalog_create_product_review(IN inCustomerId INT,
  IN inProductId INT, IN inReview TEXT, IN inRating SMALLINT)
BEGIN
  INSERT INTO review (customer_id, product_id, review, rating, created_on)
         VALUES (inCustomerId, inProductId, inReview, inRating, NOW());
END$$

-- Change back DELIMITER to ;
DELIMITER ;
