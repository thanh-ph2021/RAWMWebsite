-- MySQL dump 10.13  Distrib 8.0.15, for Win64 (x86_64)
--
-- Host: localhost    Database: db_rawmweb
-- ------------------------------------------------------
-- Server version	8.0.15

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `banquet_type`
--

DROP TABLE IF EXISTS `banquet_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `banquet_type` (
  `id` int(11) NOT NULL,
  `name` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `banquet_type`
--

LOCK TABLES `banquet_type` WRITE;
/*!40000 ALTER TABLE `banquet_type` DISABLE KEYS */;
/*!40000 ALTER TABLE `banquet_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bill`
--

DROP TABLE IF EXISTS `bill`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `bill` (
  `id` int(11) NOT NULL,
  `deposit` decimal(10,0) DEFAULT NULL,
  `forfeit` decimal(10,0) DEFAULT NULL,
  `total_money` decimal(10,0) DEFAULT NULL,
  `party_book_info` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `party_book_info` (`party_book_info`),
  CONSTRAINT `bill_ibfk_1` FOREIGN KEY (`party_book_info`) REFERENCES `party_book_information` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bill`
--

LOCK TABLES `bill` WRITE;
/*!40000 ALTER TABLE `bill` DISABLE KEYS */;
/*!40000 ALTER TABLE `bill` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `drink`
--

DROP TABLE IF EXISTS `drink`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `drink` (
  `id` int(11) NOT NULL,
  `name` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `price` decimal(10,0) DEFAULT NULL,
  `description` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `drink`
--

LOCK TABLES `drink` WRITE;
/*!40000 ALTER TABLE `drink` DISABLE KEYS */;
/*!40000 ALTER TABLE `drink` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `food`
--

DROP TABLE IF EXISTS `food`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `food` (
  `id` int(11) NOT NULL,
  `name` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `price` decimal(10,0) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `food`
--

LOCK TABLES `food` WRITE;
/*!40000 ALTER TABLE `food` DISABLE KEYS */;
/*!40000 ALTER TABLE `food` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hall`
--

DROP TABLE IF EXISTS `hall`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `hall` (
  `id` int(11) NOT NULL,
  `name` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `length` int(11) DEFAULT NULL,
  `width` int(11) DEFAULT NULL,
  `height` int(11) DEFAULT NULL,
  `capacity` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hall`
--

LOCK TABLES `hall` WRITE;
/*!40000 ALTER TABLE `hall` DISABLE KEYS */;
INSERT INTO `hall` VALUES (1,'classic',26,16,1000,500),(2,'galaxy',36,16,1000,800),(3,'royal',26,16,1000,500),(4,'diamond',36,16,1000,800);
/*!40000 ALTER TABLE `hall` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menu`
--

DROP TABLE IF EXISTS `menu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `menu` (
  `id` int(11) NOT NULL,
  `name` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu`
--

LOCK TABLES `menu` WRITE;
/*!40000 ALTER TABLE `menu` DISABLE KEYS */;
/*!40000 ALTER TABLE `menu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menu_drink`
--

DROP TABLE IF EXISTS `menu_drink`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `menu_drink` (
  `id_menu` int(11) NOT NULL,
  `id_drink` int(11) NOT NULL,
  PRIMARY KEY (`id_menu`,`id_drink`),
  KEY `id_drink` (`id_drink`),
  CONSTRAINT `menu_drink_ibfk_1` FOREIGN KEY (`id_menu`) REFERENCES `menu` (`id`),
  CONSTRAINT `menu_drink_ibfk_2` FOREIGN KEY (`id_drink`) REFERENCES `drink` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu_drink`
--

LOCK TABLES `menu_drink` WRITE;
/*!40000 ALTER TABLE `menu_drink` DISABLE KEYS */;
/*!40000 ALTER TABLE `menu_drink` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menu_food`
--

DROP TABLE IF EXISTS `menu_food`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `menu_food` (
  `id_menu` int(11) NOT NULL,
  `id_food` int(11) NOT NULL,
  PRIMARY KEY (`id_menu`,`id_food`),
  KEY `id_food` (`id_food`),
  CONSTRAINT `menu_food_ibfk_1` FOREIGN KEY (`id_menu`) REFERENCES `menu` (`id`),
  CONSTRAINT `menu_food_ibfk_2` FOREIGN KEY (`id_food`) REFERENCES `food` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu_food`
--

LOCK TABLES `menu_food` WRITE;
/*!40000 ALTER TABLE `menu_food` DISABLE KEYS */;
/*!40000 ALTER TABLE `menu_food` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `party_book_information`
--

DROP TABLE IF EXISTS `party_book_information`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `party_book_information` (
  `id` int(11) NOT NULL,
  `groom_name` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `bride_name` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `organization_date` date DEFAULT NULL,
  `deposit` decimal(10,0) DEFAULT NULL,
  `time` varchar(10) COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
  `number_table` int(11) DEFAULT NULL,
  `id_user` int(11) DEFAULT NULL,
  `id_service` int(11) DEFAULT NULL,
  `id_menu` int(11) DEFAULT NULL,
  `id_hall` int(11) DEFAULT NULL,
  `id_banquet_type` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_user` (`id_user`),
  KEY `id_service` (`id_service`),
  KEY `id_menu` (`id_menu`),
  KEY `id_hall` (`id_hall`),
  KEY `id_banquet_type` (`id_banquet_type`),
  CONSTRAINT `party_book_information_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `user` (`ID`),
  CONSTRAINT `party_book_information_ibfk_2` FOREIGN KEY (`id_service`) REFERENCES `service` (`id`),
  CONSTRAINT `party_book_information_ibfk_3` FOREIGN KEY (`id_menu`) REFERENCES `menu` (`id`),
  CONSTRAINT `party_book_information_ibfk_4` FOREIGN KEY (`id_hall`) REFERENCES `hall` (`id`),
  CONSTRAINT `party_book_information_ibfk_5` FOREIGN KEY (`id_banquet_type`) REFERENCES `banquet_type` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `party_book_information`
--

LOCK TABLES `party_book_information` WRITE;
/*!40000 ALTER TABLE `party_book_information` DISABLE KEYS */;
/*!40000 ALTER TABLE `party_book_information` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `position`
--

DROP TABLE IF EXISTS `position`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `position` (
  `id` int(11) NOT NULL,
  `name` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `position`
--

LOCK TABLES `position` WRITE;
/*!40000 ALTER TABLE `position` DISABLE KEYS */;
/*!40000 ALTER TABLE `position` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `service`
--

DROP TABLE IF EXISTS `service`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `service` (
  `id` int(11) NOT NULL,
  `name` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `price` decimal(10,0) DEFAULT NULL,
  `description` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `service`
--

LOCK TABLES `service` WRITE;
/*!40000 ALTER TABLE `service` DISABLE KEYS */;
INSERT INTO `service` VALUES (1,'Decorate wedding',NULL,NULL),(2,'Music and light',NULL,NULL),(3,'Rent outfits, wedding dress',NULL,NULL),(4,'Make up',NULL,NULL),(5,'Wedding planner',NULL,NULL);
/*!40000 ALTER TABLE `service` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `staff`
--

DROP TABLE IF EXISTS `staff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `staff` (
  `id` int(11) NOT NULL,
  `name` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `sex` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `phone` varchar(10) COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
  `email` varchar(50) COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
  `address` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `position` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `position` (`position`),
  CONSTRAINT `staff_ibfk_1` FOREIGN KEY (`position`) REFERENCES `position` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `staff`
--

LOCK TABLES `staff` WRITE;
/*!40000 ALTER TABLE `staff` DISABLE KEYS */;
/*!40000 ALTER TABLE `staff` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `user` (
  `ID` int(11) NOT NULL,
  `name` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `pass` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `username` varchar(15) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `phone` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `email` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `role` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'user','123456','user',NULL,NULL,'ROLE_USER'),(2,'admin','123456','admin',NULL,NULL,'ROLE_ADMIN');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-05-13 23:29:56
