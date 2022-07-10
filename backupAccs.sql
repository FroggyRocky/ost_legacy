create database if not exists demo;
use demo;

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accounts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `login` varchar(40) DEFAULT NULL,
  `password` varchar(32) DEFAULT NULL,
  `email` varchar(40) DEFAULT NULL,
  `email_password` varchar(32) DEFAULT NULL,
  `code2fa` varchar(100) DEFAULT NULL,
  `agent` varchar(100) DEFAULT NULL,
  `resolution` varchar(12) DEFAULT NULL,
  `language` varchar(30) DEFAULT NULL,
  `platform` varchar(10) DEFAULT NULL,
  `concurrency` int DEFAULT NULL,
  `proxy` varchar(10) DEFAULT NULL,
  `proxy_id` varchar(255) DEFAULT NULL,
  `proxy_traffic_total` varchar(255) DEFAULT NULL,
  `proxy_traffic_left` varchar(255) DEFAULT NULL,
  `proxy_ip` varchar(25) DEFAULT NULL,
  `proxy_login` varchar(40) DEFAULT NULL,
  `proxy_password` varchar(32) DEFAULT NULL,
  `proxy_date` varchar(20) DEFAULT NULL,
  `selfie` varchar(50) DEFAULT NULL,
  `token` varchar(250) DEFAULT NULL,
  `note` varchar(50) DEFAULT NULL,
  `limited` int DEFAULT NULL,
  `archived` tinyint(1) DEFAULT '0',
  `bought` datetime DEFAULT NULL,
  `birth` varchar(20) DEFAULT NULL,
  `creator` int DEFAULT NULL,
  `uuid` varchar(40) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `bmId` int DEFAULT NULL,
  `countryId` int DEFAULT NULL,
  `statusId` int DEFAULT NULL,
  `userId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `bmId` (`bmId`),
  KEY `countryId` (`countryId`),
  KEY `statusId` (`statusId`),
  KEY `userId` (`userId`),
  CONSTRAINT `accounts_ibfk_10` FOREIGN KEY (`countryId`) REFERENCES `countries` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `accounts_ibfk_11` FOREIGN KEY (`statusId`) REFERENCES `statuses` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `accounts_ibfk_12` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `accounts_ibfk_9` FOREIGN KEY (`bmId`) REFERENCES `bms` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts`
--

LOCK TABLES `accounts` WRITE;
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bmTypes`
--

DROP TABLE IF EXISTS `bmTypes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bmTypes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  `description` text,
  `price` int DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bmTypes`
--

LOCK TABLES `bmTypes` WRITE;
/*!40000 ALTER TABLE `bmTypes` DISABLE KEYS */;
/*!40000 ALTER TABLE `bmTypes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bms`
--

DROP TABLE IF EXISTS `bms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bms` (
  `id` int NOT NULL AUTO_INCREMENT,
  `faceBm` varchar(40) DEFAULT NULL,
  `link1` varchar(50) DEFAULT NULL,
  `link2` varchar(50) DEFAULT NULL,
  `link3` varchar(50) DEFAULT NULL,
  `faceToken` varchar(50) DEFAULT NULL,
  `archived` tinyint(1) DEFAULT '0',
  `bought` datetime DEFAULT NULL,
  `creator` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `bmTypeId` int DEFAULT NULL,
  `statusId` int DEFAULT NULL,
  `userId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `bmTypeId` (`bmTypeId`),
  KEY `statusId` (`statusId`),
  KEY `userId` (`userId`),
  CONSTRAINT `bms_ibfk_7` FOREIGN KEY (`bmTypeId`) REFERENCES `bmTypes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `bms_ibfk_8` FOREIGN KEY (`statusId`) REFERENCES `statuses` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `bms_ibfk_9` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bms`
--

LOCK TABLES `bms` WRITE;
/*!40000 ALTER TABLE `bms` DISABLE KEYS */;
/*!40000 ALTER TABLE `bms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `countries`
--

DROP TABLE IF EXISTS `countries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `countries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(6) NOT NULL,
  `price` int DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `countries`
--

LOCK TABLES `countries` WRITE;
/*!40000 ALTER TABLE `countries` DISABLE KEYS */;
/*!40000 ALTER TABLE `countries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `faqs`
--

DROP TABLE IF EXISTS `faqs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `faqs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `header` varchar(500) NOT NULL,
  `text` text NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `faqs`
--

LOCK TABLES `faqs` WRITE;
/*!40000 ALTER TABLE `faqs` DISABLE KEYS */;
/*!40000 ALTER TABLE `faqs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `logs`
--

DROP TABLE IF EXISTS `logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `owner` int DEFAULT NULL,
  `receiver` int DEFAULT NULL,
  `operation` int DEFAULT NULL,
  `description` varchar(600) DEFAULT NULL,
  `amount` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `logs`
--

LOCK TABLES `logs` WRITE;
/*!40000 ALTER TABLE `logs` DISABLE KEYS */;
INSERT INTO `logs` VALUES (1,2,2,5,'Registered user: 2',NULL,'2022-03-25 16:26:51','2022-03-25 16:26:51'),(2,3,3,5,'Registered user: 3',NULL,'2022-03-25 16:30:35','2022-03-25 16:30:35'),(3,4,4,5,'Registered user: 4',NULL,'2022-03-28 06:03:59','2022-03-28 06:03:59'),(4,5,5,5,'Registered user: 5',NULL,'2022-03-28 06:04:27','2022-03-28 06:04:27'),(5,6,6,5,'Registered user: 6',NULL,'2022-03-28 06:04:48','2022-03-28 06:04:48'),(6,7,7,5,'Registered user: 7',NULL,'2022-03-28 06:05:12','2022-03-28 06:05:12'),(7,8,8,5,'Registered user: 8',NULL,'2022-03-28 06:05:34','2022-03-28 06:05:34'),(8,9,9,5,'Registered user: 9',NULL,'2022-03-28 06:05:55','2022-03-28 06:05:55'),(9,10,10,5,'Registered user: 10',NULL,'2022-03-28 06:06:18','2022-03-28 06:06:18'),(10,11,11,5,'Registered user: 11',NULL,'2022-03-28 06:06:37','2022-03-28 06:06:37'),(11,12,12,5,'Registered user: 12',NULL,'2022-03-28 06:06:58','2022-03-28 06:06:58'),(12,13,13,5,'Registered user: 13',NULL,'2022-03-28 17:27:38','2022-03-28 17:27:38'),(13,14,14,5,'Registered user: 14',NULL,'2022-03-30 11:16:36','2022-03-30 11:16:36');
/*!40000 ALTER TABLE `logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `message` varchar(600) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `ticketId` int DEFAULT NULL,
  `userId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ticketId` (`ticketId`),
  KEY `userId` (`userId`),
  CONSTRAINT `messages_ibfk_5` FOREIGN KEY (`ticketId`) REFERENCES `tickets` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_6` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (1,'d','2022-03-14 11:13:31','2022-03-14 11:13:31',9,1),(2,'d\nXs\n\n','2022-03-14 11:13:35','2022-03-14 11:13:35',9,1),(3,'BITCOIN 3$','2022-03-14 11:54:21','2022-03-14 11:54:21',16,1),(4,'HELLO! HERE YOUR BITCOIN ADDRESS: 1238321838','2022-03-14 11:54:21','2022-03-14 11:54:21',16,1),(5,'BITCOIN 4$','2022-03-14 11:55:11','2022-03-14 11:55:11',17,1),(6,'HELLO! HERE YOUR BITCOIN ADDRESS: 1238321838','2022-03-14 11:55:11','2022-03-14 11:55:11',17,1),(7,'BITCOIN 2$','2022-03-14 11:58:21','2022-03-14 11:58:21',18,1),(8,'HELLO! HERE YOUR BITCOIN ADDRESS: 1238321838','2022-03-14 11:58:21','2022-03-14 11:58:21',18,1),(9,'D','2022-03-14 11:59:41','2022-03-14 11:59:41',18,1),(10,'EEEEEE','2022-03-14 11:59:44','2022-03-14 11:59:44',18,1),(11,'R','2022-03-14 14:28:29','2022-03-14 14:28:29',18,1),(12,'ETH 5$','2022-03-14 20:25:56','2022-03-14 20:25:56',19,1),(13,'HELLO! HERE YOUR ETH ADDRESS: 3821312838','2022-03-14 20:25:56','2022-03-14 20:25:56',19,1),(14,'Bitcoin ( BTC ) 222$','2022-03-19 11:07:48','2022-03-19 11:07:48',20,1),(15,'HELLO! HERE YOUR Bitcoin ( BTC ) ADDRESS: 123456789','2022-03-19 11:07:48','2022-03-19 11:07:48',20,1),(16,'Bitcoin ( BTC ) 22$','2022-03-22 13:56:19','2022-03-22 13:56:19',21,1),(17,'HELLO! HERE YOUR Bitcoin ( BTC ) ADDRESS: 12931293123','2022-03-22 13:56:19','2022-03-22 13:56:19',21,1);
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `acc_bm` int DEFAULT '0',
  `acc_bm_update` tinyint(1) DEFAULT '0',
  `users` int DEFAULT '0',
  `user_update` tinyint(1) DEFAULT '0',
  `user_balance` tinyint(1) DEFAULT '0',
  `user_roles` tinyint(1) DEFAULT '0',
  `user_active` tinyint(1) DEFAULT '0',
  `statistics` tinyint(1) DEFAULT '0',
  `price_list` tinyint(1) DEFAULT '0',
  `price_list_update` tinyint(1) DEFAULT '0',
  `log` tinyint(1) DEFAULT '0',
  `faq_update` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `permissions_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
INSERT INTO `permissions` VALUES (1,2,1,2,1,1,1,1,1,1,1,1,1,'2022-03-12 22:32:07','2022-03-12 22:32:07',1);
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `phones`
--

DROP TABLE IF EXISTS `phones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `phones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `host` varchar(40) DEFAULT NULL,
  `name` varchar(20) DEFAULT NULL,
  `phone` varchar(40) DEFAULT NULL,
  `text` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `phones`
--

LOCK TABLES `phones` WRITE;
/*!40000 ALTER TABLE `phones` DISABLE KEYS */;
/*!40000 ALTER TABLE `phones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `requisites`
--

DROP TABLE IF EXISTS `requisites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `requisites` (
  `id` int NOT NULL AUTO_INCREMENT,
  `currency_ticker` varchar(20) NOT NULL,
  `currency_name` varchar(100) DEFAULT NULL,
  `requisites` varchar(100) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `requisites`
--

LOCK TABLES `requisites` WRITE;
/*!40000 ALTER TABLE `requisites` DISABLE KEYS */;
/*!40000 ALTER TABLE `requisites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `statuses`
--

DROP TABLE IF EXISTS `statuses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `statuses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(10) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `statuses`
--

LOCK TABLES `statuses` WRITE;
/*!40000 ALTER TABLE `statuses` DISABLE KEYS */;
INSERT INTO `statuses` VALUES (1,'Ready','2022-03-12 22:32:07','2022-03-12 22:32:07'),(2,'In process','2022-03-12 22:32:07','2022-03-12 22:32:07'),(3,'Problem','2022-03-12 22:32:07','2022-03-12 22:32:07'),(4,'Replaced','2022-03-12 22:32:07','2022-03-12 22:32:07');
/*!40000 ALTER TABLE `statuses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ticketTypes`
--

DROP TABLE IF EXISTS `ticketTypes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ticketTypes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(20) DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ticketTypes`
--

LOCK TABLES `ticketTypes` WRITE;
/*!40000 ALTER TABLE `ticketTypes` DISABLE KEYS */;
INSERT INTO `ticketTypes` VALUES (1,'Balance',1,'2022-03-14 11:10:56','2022-03-14 11:10:56');
/*!40000 ALTER TABLE `ticketTypes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tickets`
--

DROP TABLE IF EXISTS `tickets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tickets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) DEFAULT NULL,
  `description` text,
  `solved` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `ticketTypeId` int DEFAULT NULL,
  `userId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ticketTypeId` (`ticketTypeId`),
  KEY `userId` (`userId`),
  CONSTRAINT `tickets_ibfk_5` FOREIGN KEY (`ticketTypeId`) REFERENCES `ticketTypes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `tickets_ibfk_6` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tickets`
--

LOCK TABLES `tickets` WRITE;
/*!40000 ALTER TABLE `tickets` DISABLE KEYS */;
INSERT INTO `tickets` VALUES (1,'TOP UP',NULL,0,'2022-03-14 10:34:59','2022-03-14 10:34:59',NULL,1),(2,'TOP UP',NULL,0,'2022-03-14 10:35:34','2022-03-14 10:35:34',NULL,1),(3,'TOP UP',NULL,0,'2022-03-14 10:44:13','2022-03-14 10:44:13',NULL,1),(4,'TOP UP',NULL,0,'2022-03-14 10:48:18','2022-03-14 10:48:18',NULL,1),(5,'TOP UP',NULL,0,'2022-03-14 10:56:20','2022-03-14 10:56:20',NULL,1),(6,'TOP UP',NULL,0,'2022-03-14 10:58:59','2022-03-14 10:58:59',NULL,1),(7,'TOP UP',NULL,0,'2022-03-14 11:02:18','2022-03-14 11:02:18',NULL,1),(8,'TOP UP',NULL,0,'2022-03-14 11:03:42','2022-03-14 11:03:42',NULL,1),(9,'TOP UP',NULL,0,'2022-03-14 11:11:06','2022-03-14 11:11:06',1,1),(10,'TOP UP',NULL,0,'2022-03-14 11:13:46','2022-03-14 11:13:46',1,1),(11,'TOP UP',NULL,0,'2022-03-14 11:33:37','2022-03-14 11:33:37',1,1),(12,'TOP UP',NULL,0,'2022-03-14 11:41:40','2022-03-14 11:41:40',1,1),(13,'TOP UP',NULL,0,'2022-03-14 11:43:41','2022-03-14 11:43:41',1,1),(14,'TOP UP',NULL,0,'2022-03-14 11:46:15','2022-03-14 11:46:15',1,1),(15,'TOP UP',NULL,0,'2022-03-14 11:50:32','2022-03-14 11:50:32',1,1),(16,'TOP UP',NULL,0,'2022-03-14 11:54:21','2022-03-14 11:54:21',1,1),(17,'TOP UP',NULL,0,'2022-03-14 11:55:11','2022-03-14 11:55:11',1,1),(18,'TOP UP',NULL,1,'2022-03-14 11:58:21','2022-03-14 14:29:03',1,1),(19,'TOP UP',NULL,0,'2022-03-14 20:25:56','2022-03-14 20:25:56',1,1),(20,'TOP UP',NULL,0,'2022-03-19 11:07:48','2022-03-19 11:07:48',1,1),(21,'TOP UP',NULL,0,'2022-03-22 13:56:19','2022-03-22 13:56:19',1,1);
/*!40000 ALTER TABLE `tickets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(50) DEFAULT NULL,
  `email_confirmed` tinyint(1) DEFAULT '0',
  `password` varchar(60) DEFAULT NULL,
  `telegram` varchar(40) DEFAULT NULL,
  `skype` varchar(40) DEFAULT NULL,
  `country` varchar(25) DEFAULT NULL,
  `balance` int DEFAULT '0',
  `page` int DEFAULT '25',
  `telMessages` tinyint(1) DEFAULT '0',
  `mla` varchar(40) DEFAULT NULL,
  `auth` tinyint(1) DEFAULT '0',
  `ru` tinyint(1) DEFAULT '1',
  `admin` tinyint(1) DEFAULT '0',
  `manager` tinyint(1) DEFAULT '0',
  `managerId` int DEFAULT '1',
  `name` varchar(10) DEFAULT NULL,
  `works` varchar(40) DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1',
  `approved` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `email_2` (`email`),
  UNIQUE KEY `email_3` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin@ostproduct.com',1,'$2b$10$aD6o6otCnS2YQ.48iRkRieTFNc60ZZUUUssr1ZRdnAJ5/xmAhbU8C',NULL,NULL,NULL,0,25,0,NULL,0,1,1,0,1,NULL,NULL,1,1,'2022-03-12 22:32:07','2022-03-12 22:32:07'),(2,'admin2@ostproduct.com',1,'$2b$10$r3V5tW5PZDz0Iulh69V2h.Yal/CV4hi6uQNbL6jsPR2cWsP4b5jRC','-','-','Afghanistan',0,25,0,'-',0,1,0,0,1,NULL,NULL,1,1,'2022-03-28 06:03:59','2022-03-28 06:03:59'),(3,'admin3@ostproduct.com',1,'$2b$10$X7VlMOKLM8jjrLMERXIuBeH7Cj1udSr5AC7vNcRm/Y79F2wRcFCSO','-','-','Afghanistan',0,25,0,'-',0,1,0,0,1,NULL,NULL,1,1,'2022-03-28 06:04:27','2022-03-28 06:04:27'),(4,'admin4@ostproduct.com',1,'$2b$10$zhP2OwT0dHrybQ2XKkPmY.ATKhny1ssY1NkpfN8n6FQRrszsRBKCe','-','-','Afghanistan',0,25,0,'-',0,1,0,0,1,NULL,NULL,1,1,'2022-03-28 06:04:48','2022-03-28 06:04:48'),(5,'admin5@ostproduct.com',1,'$2b$10$I6UITXn8nCxzLgTjLUsql.64SFhGUa6PzTSOSgr1HMgDrV7ljB58q','-','-','Afghanistan',0,25,0,'-',0,1,0,0,1,'','',1,1,'2022-03-28 06:05:12','2022-03-28 14:39:21'),(6,'admin6@ostproduct.com',1,'$2b$10$WPRkikgUX4CK0gx/SDO10O8.M4kJbczT6njxI3AE5rWbYcljRHmGK','-','-','Afghanistan',0,25,0,'-',0,1,0,0,1,NULL,NULL,1,1,'2022-03-28 06:05:34','2022-03-28 06:05:34'),(7,'admin7@ostproduct.com',1,'$2b$10$S8VJOw0M/u.498n8x7KMw.ouBXGJa08f0F6dPHdiK2beJrppPWFp2','-','-','Afghanistan',0,25,0,'-',0,1,0,0,1,NULL,NULL,1,1,'2022-03-28 06:05:55','2022-03-28 06:05:55'),(8,'admin8@ostproduct.com',1,'$2b$10$rBhLea7NnPGAnMbSmGTe1.khxyjaMWFvN2UMHnf7YmHj7v/yWbjtW','-','-','Afghanistan',0,25,0,'-',0,1,0,0,1,NULL,NULL,1,1,'2022-03-28 06:06:18','2022-03-28 06:06:18'),(9,'admin9@ostproduct.com',1,'$2b$10$.jdu9MrVLwkQErRAhnUlo.0FWQ9nUTMloAUxDlTPyWsbqjUm3xTGm','-','-','Afghanistan',0,25,0,'-',0,1,0,0,1,NULL,NULL,1,1,'2022-03-28 06:06:37','2022-03-28 06:06:37'),(10,'admin10@ostproduct.com',1,'$2b$10$Oc.OiMy3VC/1.ZPTw9b26.8i7swmcGyzxvFCezZW0glyWxHPZFAge','-','-','Afghanistan',0,25,0,'-',0,1,0,0,1,NULL,NULL,1,1,'2022-03-28 06:06:58','2022-03-28 06:06:58');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-05-02 10:48:12
