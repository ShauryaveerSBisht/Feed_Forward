-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 30, 2026 at 07:08 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `feedforward_final`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity_log`
--

CREATE TABLE `activity_log` (
  `log_id` int(11) NOT NULL,
  `action` varchar(100) DEFAULT NULL,
  `actor` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `admin_ngos`
--

CREATE TABLE `admin_ngos` (
  `admin_ngo_id` int(11) NOT NULL,
  `donation_id` int(11) DEFAULT NULL,
  `ngo_status` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin_ngos`
--

INSERT INTO `admin_ngos` (`admin_ngo_id`, `donation_id`, `ngo_status`, `created_at`) VALUES
(3, 3, 'Distributed', '2026-03-30 17:04:31');

-- --------------------------------------------------------

--
-- Table structure for table `admin_volenteer`
--

CREATE TABLE `admin_volenteer` (
  `admin_vol_id` int(11) NOT NULL,
  `volunteer_id` int(11) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin_volenteer`
--

INSERT INTO `admin_volenteer` (`admin_vol_id`, `volunteer_id`, `status`, `created_at`) VALUES
(3, NULL, 'Delivered', '2026-03-30 17:06:44');

-- --------------------------------------------------------

--
-- Table structure for table `donations`
--

CREATE TABLE `donations` (
  `donation_id` int(11) NOT NULL,
  `donor_id` int(11) NOT NULL,
  `donor_name` varchar(150) DEFAULT NULL,
  `food_type` varchar(150) DEFAULT NULL,
  `quantity` int(11) DEFAULT 1,
  `expiry_date` date DEFAULT NULL,
  `status` varchar(50) DEFAULT 'Pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `donations`
--

INSERT INTO `donations` (`donation_id`, `donor_id`, `donor_name`, `food_type`, `quantity`, `expiry_date`, `status`, `created_at`) VALUES
(3, 8, 'taj', 'matar paneer', 2, '2026-03-31', 'Distributed', '2026-03-30 17:04:04');

-- --------------------------------------------------------

--
-- Table structure for table `ngo_distributions`
--

CREATE TABLE `ngo_distributions` (
  `distribution_id` int(11) NOT NULL,
  `donation_id` int(11) NOT NULL,
  `volunteer_id` int(11) DEFAULT NULL,
  `delivery_type` varchar(30) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'Distributed',
  `delivery_verified` tinyint(1) DEFAULT 0,
  `qr_hash` varchar(255) DEFAULT NULL,
  `verified_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ngo_distributions`
--

INSERT INTO `ngo_distributions` (`distribution_id`, `donation_id`, `volunteer_id`, `delivery_type`, `status`, `delivery_verified`, `qr_hash`, `verified_at`, `created_at`) VALUES
(3, 3, NULL, 'Bike', 'Delivered', 1, '2dc7851724ba25208dab83a9', '2026-03-30 22:36:44', '2026-03-30 17:05:20');

-- --------------------------------------------------------

--
-- Table structure for table `ngo_pickup`
--

CREATE TABLE `ngo_pickup` (
  `pickup_id` int(11) NOT NULL,
  `donation_id` int(11) NOT NULL,
  `donor_name` varchar(150) DEFAULT NULL,
  `food_item` varchar(150) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  `status` varchar(50) DEFAULT 'Waiting for NGO',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ngo_pickup`
--

INSERT INTO `ngo_pickup` (`pickup_id`, `donation_id`, `donor_name`, `food_item`, `quantity`, `expiry_date`, `status`, `created_at`) VALUES
(3, 3, 'taj', 'matar paneer', 2, '2026-03-31', 'Distributed', '2026-03-30 17:04:31');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('Admin','Hotel','NGO','Volunteer') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `password_hash`, `role`, `created_at`) VALUES
(8, 'taj', '$2y$10$teAZJkl6t5LTAwi3JwETz.bKKzchIRw1xhcd9c2R0E12wkRVpO3VK', 'Hotel', '2026-03-30 17:03:30'),
(9, 'admin1', '$2y$10$KiaIUkB3ePuZt0l93yz92uyk4S52QRjNUsJKqt.IJ8lrNp9MKL9CO', 'Admin', '2026-03-30 17:04:20'),
(10, 'ngo', '$2y$10$AUPbZGMSsp4U7XLx3jP52OFS5i2pB2kUxn6BBevAId63W4Fyxd7ay', 'NGO', '2026-03-30 17:04:44'),
(11, 'volen', '$2y$10$kZ/r6YdonLaij1uKQY5RhelVvrvWZ2QsSDC4FAngGqg3p8ytrrtte', 'Volunteer', '2026-03-30 17:05:57');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_log`
--
ALTER TABLE `activity_log`
  ADD PRIMARY KEY (`log_id`);

--
-- Indexes for table `admin_ngos`
--
ALTER TABLE `admin_ngos`
  ADD PRIMARY KEY (`admin_ngo_id`);

--
-- Indexes for table `admin_volenteer`
--
ALTER TABLE `admin_volenteer`
  ADD PRIMARY KEY (`admin_vol_id`);

--
-- Indexes for table `donations`
--
ALTER TABLE `donations`
  ADD PRIMARY KEY (`donation_id`),
  ADD KEY `donor_id` (`donor_id`);

--
-- Indexes for table `ngo_distributions`
--
ALTER TABLE `ngo_distributions`
  ADD PRIMARY KEY (`distribution_id`),
  ADD KEY `donation_id` (`donation_id`),
  ADD KEY `volunteer_id` (`volunteer_id`);

--
-- Indexes for table `ngo_pickup`
--
ALTER TABLE `ngo_pickup`
  ADD PRIMARY KEY (`pickup_id`),
  ADD KEY `donation_id` (`donation_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity_log`
--
ALTER TABLE `activity_log`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `admin_ngos`
--
ALTER TABLE `admin_ngos`
  MODIFY `admin_ngo_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `admin_volenteer`
--
ALTER TABLE `admin_volenteer`
  MODIFY `admin_vol_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `donations`
--
ALTER TABLE `donations`
  MODIFY `donation_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `ngo_distributions`
--
ALTER TABLE `ngo_distributions`
  MODIFY `distribution_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `ngo_pickup`
--
ALTER TABLE `ngo_pickup`
  MODIFY `pickup_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `donations`
--
ALTER TABLE `donations`
  ADD CONSTRAINT `donations_ibfk_1` FOREIGN KEY (`donor_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `ngo_distributions`
--
ALTER TABLE `ngo_distributions`
  ADD CONSTRAINT `ngo_distributions_ibfk_1` FOREIGN KEY (`donation_id`) REFERENCES `donations` (`donation_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `ngo_distributions_ibfk_2` FOREIGN KEY (`volunteer_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL;

--
-- Constraints for table `ngo_pickup`
--
ALTER TABLE `ngo_pickup`
  ADD CONSTRAINT `ngo_pickup_ibfk_1` FOREIGN KEY (`donation_id`) REFERENCES `donations` (`donation_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
