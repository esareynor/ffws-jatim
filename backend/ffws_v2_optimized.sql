/*
 Navicat Premium Dump SQL - OPTIMIZED & FIXED VERSION

 Source Server         : localhost_3306
 Source Server Type    : MySQL
 Source Server Version : 90400 (9.4.0)
 Source Host           : localhost:3306
 Source Schema         : ffws_v2

 Target Server Type    : MySQL
 Target Server Version : 90400 (9.4.0)
 File Encoding         : 65001

 Date: 31/10/2025 09:23:57
 Last Updated: 02/11/2025 (Fixed Version)
 
 OPTIMIZATIONS APPLIED:
 - Fixed data type inconsistencies
 - Added missing AUTO_INCREMENT
 - Optimized indexes for time-series queries
 - Added composite indexes for common query patterns
 - Added CHECK constraints for data validation
 - Standardized field naming and types
 - Added partitioning hints for large tables
 
 FIXES IN THIS VERSION (02/11/2025):
 - ✅ Fixed foreign key dependency order (users before device_media)
 - ✅ Fixed threshold table drop order (before mas_sensors)
 - ✅ Added security notes for password encryption
 - ✅ Added composite index for active threshold lookups
 - ✅ Added composite index for sensor status queries
 - ✅ Added clarifying comments throughout
 - ✅ Documented naming conventions and table purposes
 - ✅ Added comprehensive maintenance queries
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- IMPORTANT: Tables are dropped in reverse dependency order
-- to avoid foreign key constraint errors
-- ----------------------------

-- ----------------------------
-- Table structure for cache
-- ----------------------------
DROP TABLE IF EXISTS `cache`;
CREATE TABLE `cache`  (
  `key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`) USING BTREE,
  INDEX `idx_cache_expiration`(`expiration` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for cache_locks
-- ----------------------------
DROP TABLE IF EXISTS `cache_locks`;
CREATE TABLE `cache_locks`  (
  `key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`) USING BTREE,
  INDEX `idx_cache_locks_expiration`(`expiration` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for mas_cities
-- ----------------------------
DROP TABLE IF EXISTS `mas_cities`;
CREATE TABLE `mas_cities`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_cities_code`(`code` ASC) USING BTREE,
  INDEX `idx_cities_name`(`name` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for mas_provinces
-- NOTE: Naming convention uses prefixed fields (provinces_name, provinces_code)
-- while mas_cities and mas_villages use unprefixed (name, code)
-- This is kept for backward compatibility
-- ----------------------------
DROP TABLE IF EXISTS `mas_provinces`;
CREATE TABLE `mas_provinces`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `provinces_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `provinces_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_provinces_code`(`provinces_code` ASC) USING BTREE,
  INDEX `idx_provinces_name`(`provinces_name` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for mas_regencies
-- NOTE: Uses prefixed naming (regencies_name, regencies_code) for consistency with mas_provinces
-- ----------------------------
DROP TABLE IF EXISTS `mas_regencies`;
CREATE TABLE `mas_regencies`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `regencies_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `regencies_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_regencies_code`(`regencies_code` ASC) USING BTREE,
  INDEX `idx_regencies_name`(`regencies_name` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for mas_villages
-- ----------------------------
DROP TABLE IF EXISTS `mas_villages`;
CREATE TABLE `mas_villages`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_villages_code`(`code` ASC) USING BTREE,
  INDEX `idx_villages_name`(`name` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for mas_river_basins
-- ----------------------------
DROP TABLE IF EXISTS `mas_river_basins`;
CREATE TABLE `mas_river_basins`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `cities_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_river_basins_code`(`code` ASC) USING BTREE,
  INDEX `idx_rbasin_name`(`name` ASC) USING BTREE,
  INDEX `fk_rbasin_city_code`(`cities_code` ASC) USING BTREE,
  CONSTRAINT `fk_rbasin_city_code` FOREIGN KEY (`cities_code`) REFERENCES `mas_cities` (`code`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 14 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for mas_watersheds
-- ----------------------------
DROP TABLE IF EXISTS `mas_watersheds`;
CREATE TABLE `mas_watersheds`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `river_basin_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_watersheds_code`(`code` ASC) USING BTREE,
  INDEX `idx_ws_name`(`name` ASC) USING BTREE,
  INDEX `fk_ws_basin_code`(`river_basin_code` ASC) USING BTREE,
  CONSTRAINT `fk_ws_basin_code` FOREIGN KEY (`river_basin_code`) REFERENCES `mas_river_basins` (`code`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for mas_upts
-- ----------------------------
DROP TABLE IF EXISTS `mas_upts`;
CREATE TABLE `mas_upts`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `river_basin_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `cities_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_upts_code`(`code` ASC) USING BTREE,
  INDEX `idx_upt_name`(`name` ASC) USING BTREE,
  INDEX `fk_upt_basin_code`(`river_basin_code` ASC) USING BTREE,
  INDEX `fk_upt_city_code`(`cities_code` ASC) USING BTREE,
  CONSTRAINT `fk_upt_basin_code` FOREIGN KEY (`river_basin_code`) REFERENCES `mas_river_basins` (`code`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_upt_city_code` FOREIGN KEY (`cities_code`) REFERENCES `mas_cities` (`code`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for mas_uptds
-- ----------------------------
DROP TABLE IF EXISTS `mas_uptds`;
CREATE TABLE `mas_uptds`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `upt_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_uptds_code`(`code` ASC) USING BTREE,
  INDEX `idx_uptd_name`(`name` ASC) USING BTREE,
  INDEX `fk_uptd_upt_code`(`upt_code` ASC) USING BTREE,
  CONSTRAINT `fk_uptd_upt_code` FOREIGN KEY (`upt_code`) REFERENCES `mas_upts` (`code`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for mas_device_parameters
-- ----------------------------
DROP TABLE IF EXISTS `mas_device_parameters`;
CREATE TABLE `mas_device_parameters`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_device_parameters_code`(`code` ASC) USING BTREE,
  INDEX `idx_device_param_name`(`name` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for mas_devices
-- ----------------------------
DROP TABLE IF EXISTS `mas_devices`;
CREATE TABLE `mas_devices`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `mas_river_basin_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `latitude` decimal(10, 6) NOT NULL,
  `longitude` decimal(10, 6) NOT NULL,
  `elevation_m` decimal(8, 2) NOT NULL,
  `status` enum('active','inactive') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_devices_code`(`code` ASC) USING BTREE,
  INDEX `idx_devices_name`(`name` ASC) USING BTREE,
  INDEX `idx_devices_status`(`status` ASC) USING BTREE,
  INDEX `idx_devices_location`(`latitude` ASC, `longitude` ASC) USING BTREE,
  INDEX `fk_md_basin_code`(`mas_river_basin_code` ASC) USING BTREE,
  CONSTRAINT `fk_md_basin_code` FOREIGN KEY (`mas_river_basin_code`) REFERENCES `mas_river_basins` (`code`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `chk_devices_latitude` CHECK (`latitude` >= -90 AND `latitude` <= 90),
  CONSTRAINT `chk_devices_longitude` CHECK (`longitude` >= -180 AND `longitude` <= 180)
) ENGINE = InnoDB AUTO_INCREMENT = 88 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for mas_models
-- ----------------------------
DROP TABLE IF EXISTS `mas_models`;
CREATE TABLE `mas_models`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `version` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `file_path` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `n_steps_in` tinyint UNSIGNED NULL DEFAULT NULL,
  `n_steps_out` tinyint UNSIGNED NULL DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_models_code`(`code` ASC) USING BTREE,
  INDEX `idx_models_type`(`type` ASC) USING BTREE,
  INDEX `idx_models_active`(`is_active` ASC) USING BTREE,
  CONSTRAINT `chk_models_steps` CHECK (`n_steps_in` > 0 AND `n_steps_out` > 0)
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for mas_sensor_parameters
-- ----------------------------
DROP TABLE IF EXISTS `mas_sensor_parameters`;
CREATE TABLE `mas_sensor_parameters`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_sensor_parameters_code`(`code` ASC) USING BTREE,
  INDEX `idx_sensor_param_name`(`name` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ============================================
-- DYNAMIC SENSOR THRESHOLD SYSTEM
-- Replaces fixed 4-value system with unlimited threshold levels
-- Note: Legacy threshold fields (threshold_safe, threshold_warning, threshold_danger) 
-- are kept in mas_sensors for backward compatibility and fallback values
-- ============================================

-- ----------------------------
-- Table structure for mas_sensor_threshold_templates
-- Main threshold configuration/template
-- NOTE: These tables must be dropped AFTER mas_sensor_threshold_assignments
-- which references mas_sensors (created later)
-- ----------------------------

CREATE TABLE `mas_sensor_threshold_templates` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `parameter_type` enum('water_level','rainfall','discharge','temperature','other') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'water_level',
  `unit` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_threshold_template_code`(`code` ASC) USING BTREE,
  INDEX `idx_threshold_template_parameter`(`parameter_type` ASC) USING BTREE,
  INDEX `idx_threshold_template_active`(`is_active` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC
COMMENT = 'Threshold templates - main configuration for sensor thresholds';

-- ----------------------------
-- Table structure for mas_sensor_threshold_levels
-- Individual threshold levels (unlimited per template)
-- ----------------------------
CREATE TABLE `mas_sensor_threshold_levels` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `threshold_template_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `level_order` int NOT NULL,
  `level_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `level_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `min_value` decimal(12, 4) NULL DEFAULT NULL,
  `max_value` decimal(12, 4) NULL DEFAULT NULL,
  `color` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `color_hex` varchar(7) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `severity` enum('normal','watch','warning','danger','critical') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'normal',
  `alert_enabled` tinyint(1) NOT NULL DEFAULT 0,
  `alert_message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_threshold_level_code`(`level_code` ASC) USING BTREE,
  INDEX `idx_threshold_level_template`(`threshold_template_code` ASC) USING BTREE,
  INDEX `idx_threshold_level_order`(`level_order` ASC) USING BTREE,
  INDEX `idx_threshold_level_severity`(`severity` ASC) USING BTREE,
  CONSTRAINT `fk_threshold_level_template` 
    FOREIGN KEY (`threshold_template_code`) 
    REFERENCES `mas_sensor_threshold_templates` (`code`) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC
COMMENT = 'Threshold levels - individual threshold values (unlimited per template)';

-- ----------------------------
-- Table structure for mas_sensor_threshold_assignments
-- Link sensors to threshold templates
-- ----------------------------
CREATE TABLE `mas_sensor_threshold_assignments` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `mas_sensor_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `threshold_template_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `effective_from` date NOT NULL,
  `effective_to` date NULL DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_sensor_threshold_sensor`(`mas_sensor_code` ASC) USING BTREE,
  INDEX `idx_sensor_threshold_template`(`threshold_template_code` ASC) USING BTREE,
  INDEX `idx_sensor_threshold_dates`(`effective_from` ASC, `effective_to` ASC) USING BTREE,
  INDEX `idx_sensor_threshold_active`(`is_active` ASC) USING BTREE,
  INDEX `idx_sensor_threshold_active_lookup`(`mas_sensor_code` ASC, `is_active` ASC, `effective_from` ASC, `effective_to` ASC) USING BTREE,
  CONSTRAINT `fk_sensor_threshold_sensor` 
    FOREIGN KEY (`mas_sensor_code`) 
    REFERENCES `mas_sensors` (`code`) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE,
  CONSTRAINT `fk_sensor_threshold_template_assign` 
    FOREIGN KEY (`threshold_template_code`) 
    REFERENCES `mas_sensor_threshold_templates` (`code`) 
    ON DELETE RESTRICT 
    ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC
COMMENT = 'Assign threshold templates to sensors with effective dates';

-- ----------------------------
-- Table structure for mas_sensors
-- FIXED: Changed device_code from bigint to varchar(100) for consistency
-- NOTE: Legacy threshold fields are kept for backward compatibility
-- Use dynamic threshold system (mas_sensor_threshold_*) for new implementations
-- ----------------------------
DROP TABLE IF EXISTS `mas_sensor_threshold_assignments`;
DROP TABLE IF EXISTS `mas_sensor_threshold_levels`;
DROP TABLE IF EXISTS `mas_sensor_threshold_templates`;
DROP TABLE IF EXISTS `mas_sensors`;
CREATE TABLE `mas_sensors`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `mas_device_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `parameter` enum('water_level','rainfall') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `unit` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `mas_model_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `threshold_safe` decimal(10, 3) NULL DEFAULT NULL,
  `threshold_warning` decimal(10, 3) NULL DEFAULT NULL,
  `threshold_danger` decimal(10, 3) NULL DEFAULT NULL,
  `status` enum('active','inactive') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `forecasting_status` enum('stopped','running','paused') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'stopped',
  `is_active` tinyint(1) NULL DEFAULT 1,
  `last_seen` datetime NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_sensors_code`(`code` ASC) USING BTREE,
  INDEX `idx_sensors_parameter`(`parameter` ASC) USING BTREE,
  INDEX `idx_sensors_status`(`status` ASC, `is_active` ASC) USING BTREE,
  INDEX `idx_sensors_forecasting`(`forecasting_status` ASC) USING BTREE,
  INDEX `idx_sensors_last_seen`(`last_seen` ASC) USING BTREE,
  INDEX `fk_sensor_device_code`(`mas_device_code` ASC) USING BTREE,
  INDEX `fk_sensor_model_code`(`mas_model_code` ASC) USING BTREE,
  CONSTRAINT `fk_sensor_device_code` FOREIGN KEY (`mas_device_code`) REFERENCES `mas_devices` (`code`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_sensor_model_code` FOREIGN KEY (`mas_model_code`) REFERENCES `mas_models` (`code`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `chk_sensors_thresholds` CHECK (`threshold_safe` IS NULL OR `threshold_warning` IS NULL OR `threshold_danger` IS NULL OR 
    (`threshold_safe` < `threshold_warning` AND `threshold_warning` < `threshold_danger`))
) ENGINE = InnoDB AUTO_INCREMENT = 80 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for mas_scalers
-- ----------------------------
DROP TABLE IF EXISTS `mas_scalers`;
CREATE TABLE `mas_scalers`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `mas_model_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `mas_sensor_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `io_axis` enum('x','y') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `technique` enum('standard','minmax','robust','custom') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'custom',
  `version` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `file_path` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_hash_sha256` char(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_scalers_code`(`code` ASC) USING BTREE,
  UNIQUE INDEX `uk_model_sensor_axis_active`(`mas_model_code` ASC, `mas_sensor_code` ASC, `io_axis` ASC, `is_active` ASC) USING BTREE,
  INDEX `idx_scalers_active`(`is_active` ASC) USING BTREE,
  INDEX `idx_scalers_sensor_code`(`mas_sensor_code` ASC) USING BTREE,
  INDEX `fk_scaler_model_code`(`mas_model_code` ASC) USING BTREE,
  CONSTRAINT `fk_scaler_model_code` FOREIGN KEY (`mas_model_code`) REFERENCES `mas_models` (`code`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_scaler_sensor_code` FOREIGN KEY (`mas_sensor_code`) REFERENCES `mas_sensors` (`code`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for rating_curves
-- ----------------------------
DROP TABLE IF EXISTS `rating_curves`;
CREATE TABLE `rating_curves`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `mas_sensor_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `formula_type` enum('power','polynomial','exponential','custom') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `a` decimal(15, 6) NOT NULL,
  `b` decimal(15, 6) NULL DEFAULT NULL,
  `c` decimal(15, 6) NULL DEFAULT NULL,
  `effective_date` date NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_rating_curves_code`(`code` ASC) USING BTREE,
  INDEX `idx_rc_sensor_date`(`mas_sensor_code` ASC, `effective_date` DESC) USING BTREE,
  INDEX `idx_rc_effective_date`(`effective_date` ASC) USING BTREE,
  CONSTRAINT `fk_rc_sensor_code` FOREIGN KEY (`mas_sensor_code`) REFERENCES `mas_sensors` (`code`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for data_actuals
-- OPTIMIZED: Added composite indexes for time-series queries
-- ----------------------------
DROP TABLE IF EXISTS `data_actuals`;
CREATE TABLE `data_actuals`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `mas_sensor_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` decimal(12, 4) NOT NULL,
  `received_at` datetime NOT NULL,
  `threshold_status` enum('normal','watch','warning','danger','unknown') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'unknown',
  `received_date` date GENERATED ALWAYS AS (cast(`received_at` as date)) STORED NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uq_da_sensor_ts`(`mas_sensor_code` ASC, `received_at` ASC) USING BTREE,
  INDEX `idx_da_received_at`(`received_at` DESC) USING BTREE,
  INDEX `idx_da_date`(`received_date` DESC) USING BTREE,
  INDEX `idx_da_threshold_status`(`threshold_status` ASC, `received_at` DESC) USING BTREE,
  INDEX `idx_da_sensor_date`(`mas_sensor_code` ASC, `received_date` DESC) USING BTREE,
  INDEX `idx_da_sensor_status_date`(`mas_sensor_code` ASC, `threshold_status` ASC, `received_at` DESC) USING BTREE,
  CONSTRAINT `fk_da_sensor_code` FOREIGN KEY (`mas_sensor_code`) REFERENCES `mas_sensors` (`code`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC
COMMENT = 'Consider partitioning by RANGE(TO_DAYS(received_date)) for large datasets';

-- ----------------------------
-- Table structure for data_predictions
-- OPTIMIZED: Added composite indexes for prediction queries
-- ----------------------------
DROP TABLE IF EXISTS `data_predictions`;
CREATE TABLE `data_predictions`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `mas_sensor_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `mas_model_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `prediction_run_at` datetime NOT NULL,
  `prediction_for_ts` datetime NOT NULL,
  `predicted_value` decimal(12, 4) NOT NULL,
  `confidence_score` decimal(5, 4) NULL DEFAULT NULL,
  `threshold_prediction_status` enum('normal','watch','warning','danger','unknown') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'unknown',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uq_dp_sensor_t_model`(`mas_sensor_code` ASC, `prediction_for_ts` ASC, `mas_model_code` ASC) USING BTREE,
  INDEX `idx_dp_prediction_run_at`(`prediction_run_at` DESC) USING BTREE,
  INDEX `idx_dp_sensor_for_ts`(`mas_sensor_code` ASC, `prediction_for_ts` DESC) USING BTREE,
  INDEX `idx_dp_model_run`(`mas_model_code` ASC, `prediction_run_at` DESC) USING BTREE,
  INDEX `idx_dp_threshold_status`(`threshold_prediction_status` ASC, `prediction_for_ts` DESC) USING BTREE,
  CONSTRAINT `fk_dp_model_code` FOREIGN KEY (`mas_model_code`) REFERENCES `mas_models` (`code`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_dp_sensor_code` FOREIGN KEY (`mas_sensor_code`) REFERENCES `mas_sensors` (`code`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `chk_dp_confidence` CHECK (`confidence_score` IS NULL OR (`confidence_score` >= 0 AND `confidence_score` <= 1))
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC
COMMENT = 'Consider partitioning by RANGE(TO_DAYS(prediction_for_ts)) for large datasets';

-- ----------------------------
-- Table structure for calculated_discharges
-- ----------------------------
DROP TABLE IF EXISTS `calculated_discharges`;
CREATE TABLE `calculated_discharges`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `mas_sensor_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `sensor_value` decimal(12, 4) NOT NULL,
  `sensor_discharge` decimal(15, 4) NOT NULL,
  `rating_curve_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `calculated_at` datetime NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uq_cd_sensor_ts`(`mas_sensor_code` ASC, `calculated_at` ASC) USING BTREE,
  INDEX `idx_cd_calculated_at`(`calculated_at` DESC) USING BTREE,
  INDEX `idx_cd_sensor_calc`(`mas_sensor_code` ASC, `calculated_at` DESC) USING BTREE,
  INDEX `idx_cd_curve`(`rating_curve_code` ASC) USING BTREE,
  CONSTRAINT `fk_cd_curve_code` FOREIGN KEY (`rating_curve_code`) REFERENCES `rating_curves` (`code`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_cd_sensor_code` FOREIGN KEY (`mas_sensor_code`) REFERENCES `mas_sensors` (`code`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `chk_cd_discharge` CHECK (`sensor_discharge` >= 0)
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for predicted_calculated_discharges
-- ----------------------------
DROP TABLE IF EXISTS `predicted_calculated_discharges`;
CREATE TABLE `predicted_calculated_discharges`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `mas_sensor_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `predicted_value` decimal(12, 4) NOT NULL,
  `predicted_discharge` decimal(15, 4) NOT NULL,
  `rating_curve_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `calculated_at` datetime NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uq_pcd_sensor_ts`(`mas_sensor_code` ASC, `calculated_at` ASC) USING BTREE,
  INDEX `idx_pcd_calculated_at`(`calculated_at` DESC) USING BTREE,
  INDEX `idx_pcd_sensor_calc`(`mas_sensor_code` ASC, `calculated_at` DESC) USING BTREE,
  INDEX `idx_pcd_curve`(`rating_curve_code` ASC) USING BTREE,
  CONSTRAINT `fk_pcd_curve_code` FOREIGN KEY (`rating_curve_code`) REFERENCES `rating_curves` (`code`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_pcd_sensor_code` FOREIGN KEY (`mas_sensor_code`) REFERENCES `mas_sensors` (`code`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `chk_pcd_discharge` CHECK (`predicted_discharge` >= 0)
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for users (moved here to resolve FK dependencies)
-- ----------------------------
DROP TABLE IF EXISTS `password_reset_tokens`;
DROP TABLE IF EXISTS `sessions`;
DROP TABLE IF EXISTS `personal_access_tokens`;
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('admin','user','moderator') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user',
  `status` enum('active','inactive','pending') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `bio` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_users_email`(`email` ASC) USING BTREE,
  INDEX `idx_users_role`(`role` ASC) USING BTREE,
  INDEX `idx_users_status`(`status` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for device_values
-- Basic device location and metadata
-- NOTE: This table extends mas_devices with additional location and metadata
-- One device can have multiple device_values records for historical tracking
-- ----------------------------
DROP TABLE IF EXISTS `device_cctv`;
DROP TABLE IF EXISTS `device_media`;
DROP TABLE IF EXISTS `device_values`;

CREATE TABLE `device_values`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `mas_device_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `mas_river_basin_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `mas_watershed_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `mas_city_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `mas_regency_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `mas_village_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `mas_upt_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `mas_uptd_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `mas_device_parameter_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `icon_path` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `latitude` decimal(10, 6) NULL DEFAULT NULL,
  `longitude` decimal(10, 6) NULL DEFAULT NULL,
  `elevation` decimal(8, 2) NULL DEFAULT NULL,
  `status` enum('active','inactive','pending','maintenance') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `installation_date` date NULL DEFAULT NULL,
  `last_maintenance` date NULL DEFAULT NULL,
  `next_maintenance` date NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_dv_device_code`(`mas_device_code` ASC) USING BTREE,
  INDEX `idx_dv_rbasin`(`mas_river_basin_code` ASC) USING BTREE,
  INDEX `idx_dv_watershed`(`mas_watershed_code` ASC) USING BTREE,
  INDEX `idx_dv_city`(`mas_city_code` ASC) USING BTREE,
  INDEX `idx_dv_regency`(`mas_regency_code` ASC) USING BTREE,
  INDEX `idx_dv_village`(`mas_village_code` ASC) USING BTREE,
  INDEX `idx_dv_upt`(`mas_upt_code` ASC) USING BTREE,
  INDEX `idx_dv_uptd`(`mas_uptd_code` ASC) USING BTREE,
  INDEX `idx_dv_param`(`mas_device_parameter_code` ASC) USING BTREE,
  INDEX `idx_dv_status`(`status` ASC) USING BTREE,
  CONSTRAINT `fk_dv_city_code` FOREIGN KEY (`mas_city_code`) REFERENCES `mas_cities` (`code`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_dv_device_code` FOREIGN KEY (`mas_device_code`) REFERENCES `mas_devices` (`code`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_dv_device_param` FOREIGN KEY (`mas_device_parameter_code`) REFERENCES `mas_device_parameters` (`code`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_dv_rbasin_code` FOREIGN KEY (`mas_river_basin_code`) REFERENCES `mas_river_basins` (`code`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_dv_regency_code` FOREIGN KEY (`mas_regency_code`) REFERENCES `mas_regencies` (`regencies_code`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_dv_upt_code` FOREIGN KEY (`mas_upt_code`) REFERENCES `mas_upts` (`code`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_dv_uptd_code` FOREIGN KEY (`mas_uptd_code`) REFERENCES `mas_uptds` (`code`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_dv_village_code` FOREIGN KEY (`mas_village_code`) REFERENCES `mas_villages` (`code`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_dv_ws_code` FOREIGN KEY (`mas_watershed_code`) REFERENCES `mas_watersheds` (`code`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `chk_dv_latitude` CHECK (`latitude` IS NULL OR (`latitude` >= -90 AND `latitude` <= 90)),
  CONSTRAINT `chk_dv_longitude` CHECK (`longitude` IS NULL OR (`longitude` >= -180 AND `longitude` <= 180))
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC
COMMENT = 'Device location and basic metadata';

-- ----------------------------
-- Table structure for device_cctv
-- CCTV configuration for devices
-- SECURITY NOTE: password field should store ENCRYPTED values only
-- Use Laravel's Crypt::encrypt() before storing passwords
-- ----------------------------
CREATE TABLE `device_cctv` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `mas_device_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `cctv_url` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `stream_type` enum('rtsp','hls','mjpeg','webrtc','youtube','other') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'rtsp',
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'Store encrypted values only',
  `status` enum('online','offline','error','unknown') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'unknown',
  `last_check` datetime NULL DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_device_cctv_device`(`mas_device_code` ASC) USING BTREE,
  INDEX `idx_dc_status`(`status` ASC) USING BTREE,
  INDEX `idx_dc_active`(`is_active` ASC) USING BTREE,
  CONSTRAINT `fk_dc_device_code` FOREIGN KEY (`mas_device_code`) REFERENCES `mas_devices` (`code`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC
COMMENT = 'CCTV configuration for devices';

-- ----------------------------
-- Table structure for device_media
-- Store images, videos, and documents for devices
-- ----------------------------
CREATE TABLE `device_media` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `mas_device_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `media_type` enum('image','video','document','cctv_snapshot','thumbnail','other') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'image',
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `file_path` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_size` bigint UNSIGNED NULL DEFAULT NULL,
  `mime_type` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `file_hash` char(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `disk` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'public',
  `is_primary` tinyint(1) NOT NULL DEFAULT 0,
  `is_public` tinyint(1) NOT NULL DEFAULT 1,
  `display_order` int NOT NULL DEFAULT 0,
  `captured_at` datetime NULL DEFAULT NULL,
  `uploaded_by` bigint UNSIGNED NULL DEFAULT NULL,
  `tags` json NULL,
  `metadata` json NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_dm_device_code`(`mas_device_code` ASC) USING BTREE,
  INDEX `idx_dm_media_type`(`media_type` ASC) USING BTREE,
  INDEX `idx_dm_is_primary`(`is_primary` ASC) USING BTREE,
  INDEX `idx_dm_captured_at`(`captured_at` DESC) USING BTREE,
  INDEX `idx_dm_display_order`(`display_order` ASC) USING BTREE,
  INDEX `idx_dm_uploaded_by`(`uploaded_by` ASC) USING BTREE,
  CONSTRAINT `fk_dm_device_code` FOREIGN KEY (`mas_device_code`) REFERENCES `mas_devices` (`code`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_dm_uploaded_by` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC
COMMENT = 'Media files (images, videos, documents) for devices';

-- ----------------------------
-- Table structure for sensor_values
-- NOTE: This table stores additional sensor metadata and display information
-- Differs from mas_sensors which stores core sensor configuration
-- Use this for UI/display purposes, mas_sensors for operational data
-- ----------------------------
DROP TABLE IF EXISTS `sensor_values`;
CREATE TABLE `sensor_values`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `mas_sensor_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `mas_sensor_parameter_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `mas_sensor_threshold_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `sensor_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `sensor_unit` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `sensor_description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `sensor_icon_path` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `status` enum('active','inactive','fault') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `last_seen` datetime NULL DEFAULT NULL,
  `is_active` tinyint(1) NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_sv_sensor_code`(`mas_sensor_code` ASC) USING BTREE,
  INDEX `idx_sv_param`(`mas_sensor_parameter_code` ASC) USING BTREE,
  INDEX `idx_sv_threshold`(`mas_sensor_threshold_code` ASC) USING BTREE,
  INDEX `idx_sv_status`(`status` ASC, `is_active` ASC) USING BTREE,
  INDEX `idx_sv_last_seen`(`last_seen` ASC) USING BTREE,
  CONSTRAINT `fk_sv_param_code` FOREIGN KEY (`mas_sensor_parameter_code`) REFERENCES `mas_sensor_parameters` (`code`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_sv_sensor_code` FOREIGN KEY (`mas_sensor_code`) REFERENCES `mas_sensors` (`code`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_sv_threshold_code` FOREIGN KEY (`mas_sensor_threshold_code`) REFERENCES `mas_sensor_threshold_templates` (`code`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for geojson_files
-- ----------------------------
DROP TABLE IF EXISTS `geojson_files`;
CREATE TABLE `geojson_files`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `original_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `stored_path` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `disk` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'local',
  `size` bigint UNSIGNED NULL DEFAULT NULL,
  `mime_type` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `sha256` char(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `label` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_geojson_sha256`(`sha256` ASC) USING BTREE,
  INDEX `idx_geojson_label`(`label` ASC) USING BTREE,
  INDEX `idx_geojson_created`(`created_at` DESC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for geojson_mapping
-- ----------------------------
DROP TABLE IF EXISTS `geojson_mapping`;
CREATE TABLE `geojson_mapping`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `geojson_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `mas_device_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `mas_river_basin_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `mas_watershed_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `mas_city_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `mas_regency_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `mas_village_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `mas_upt_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `mas_uptd_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `mas_device_parameter_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `value_min` decimal(12, 4) NULL DEFAULT NULL,
  `value_max` decimal(12, 4) NULL DEFAULT NULL,
  `file_path` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `version` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `properties_content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_geojson_mapping_code`(`geojson_code` ASC) USING BTREE,
  INDEX `idx_gm_device`(`mas_device_code` ASC) USING BTREE,
  INDEX `idx_gm_rbasin`(`mas_river_basin_code` ASC) USING BTREE,
  INDEX `idx_gm_watershed`(`mas_watershed_code` ASC) USING BTREE,
  INDEX `idx_gm_city`(`mas_city_code` ASC) USING BTREE,
  INDEX `idx_gm_regency`(`mas_regency_code` ASC) USING BTREE,
  INDEX `idx_gm_village`(`mas_village_code` ASC) USING BTREE,
  INDEX `idx_gm_upt`(`mas_upt_code` ASC) USING BTREE,
  INDEX `idx_gm_uptd`(`mas_uptd_code` ASC) USING BTREE,
  INDEX `idx_gm_device_param`(`mas_device_parameter_code` ASC) USING BTREE,
  CONSTRAINT `fk_gm_city_code` FOREIGN KEY (`mas_city_code`) REFERENCES `mas_cities` (`code`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_gm_device_code` FOREIGN KEY (`mas_device_code`) REFERENCES `mas_devices` (`code`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_gm_device_param` FOREIGN KEY (`mas_device_parameter_code`) REFERENCES `mas_device_parameters` (`code`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_gm_rbasin_code` FOREIGN KEY (`mas_river_basin_code`) REFERENCES `mas_river_basins` (`code`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_gm_regency_code` FOREIGN KEY (`mas_regency_code`) REFERENCES `mas_regencies` (`regencies_code`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_gm_upt_code` FOREIGN KEY (`mas_upt_code`) REFERENCES `mas_upts` (`code`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_gm_uptd_code` FOREIGN KEY (`mas_uptd_code`) REFERENCES `mas_uptds` (`code`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_gm_village_code` FOREIGN KEY (`mas_village_code`) REFERENCES `mas_villages` (`code`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_gm_ws_code` FOREIGN KEY (`mas_watershed_code`) REFERENCES `mas_watersheds` (`code`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for mas_river_shape
-- FIXED: Added AUTO_INCREMENT to PRIMARY KEY
-- ----------------------------
DROP TABLE IF EXISTS `mas_river_shape`;
CREATE TABLE `mas_river_shape`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `sensor_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `array_codes` json NULL,
  `x` decimal(15, 6) NULL DEFAULT NULL,
  `y` decimal(15, 6) NULL DEFAULT NULL,
  `a` decimal(15, 6) NULL DEFAULT NULL,
  `b` decimal(15, 6) NULL DEFAULT NULL,
  `c` decimal(15, 6) NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_river_shape_code`(`code` ASC) USING BTREE,
  INDEX `idx_river_shape_sensor`(`sensor_code` ASC) USING BTREE,
  CONSTRAINT `fk_river_shape_sensor` FOREIGN KEY (`sensor_code`) REFERENCES `mas_sensors` (`code`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for mas_whatsapp_numbers
-- ----------------------------
DROP TABLE IF EXISTS `mas_whatsapp_numbers`;
CREATE TABLE `mas_whatsapp_numbers`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `number` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_whatsapp_number`(`number` ASC) USING BTREE,
  INDEX `idx_whatsapp_active`(`is_active` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- NOTE: users table has been moved earlier in the file (before device_media)
-- to resolve foreign key dependencies
-- ----------------------------

-- ----------------------------
-- Table structure for user_by_role
-- ----------------------------
DROP TABLE IF EXISTS `user_by_role`;
CREATE TABLE `user_by_role`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `phone_number` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `upt_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `role` enum('admin','user','moderator') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user',
  `status` enum('active','inactive','pending') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `bio` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_user_by_role_upt`(`upt_code` ASC) USING BTREE,
  INDEX `idx_ubr_role`(`role` ASC) USING BTREE,
  INDEX `idx_ubr_status`(`status` ASC) USING BTREE,
  CONSTRAINT `fk_ubr_upt_code` FOREIGN KEY (`upt_code`) REFERENCES `mas_upts` (`code`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for password_reset_tokens
-- ----------------------------
CREATE TABLE `password_reset_tokens`  (
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`) USING BTREE,
  INDEX `idx_prt_created_at`(`created_at` ASC) USING BTREE,
  CONSTRAINT `fk_prt_users_email` FOREIGN KEY (`email`) REFERENCES `users` (`email`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for sessions
-- ----------------------------
CREATE TABLE `sessions`  (
  `id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint UNSIGNED NULL DEFAULT NULL,
  `ip_address` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `user_agent` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_sessions_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_sessions_last_activity`(`last_activity` ASC) USING BTREE,
  CONSTRAINT `fk_sessions_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for personal_access_tokens
-- ----------------------------
CREATE TABLE `personal_access_tokens`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint UNSIGNED NOT NULL,
  `name` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_personal_access_tokens_token`(`token` ASC) USING BTREE,
  INDEX `idx_pat_tokenable`(`tokenable_type` ASC, `tokenable_id` ASC) USING BTREE,
  INDEX `idx_pat_expires_at`(`expires_at` ASC) USING BTREE,
  INDEX `idx_pat_last_used`(`last_used_at` DESC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for failed_jobs
-- ----------------------------
DROP TABLE IF EXISTS `failed_jobs`;
CREATE TABLE `failed_jobs`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_failed_jobs_uuid`(`uuid` ASC) USING BTREE,
  INDEX `idx_failed_jobs_failed_at`(`failed_at` DESC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for job_batches
-- ----------------------------
DROP TABLE IF EXISTS `job_batches`;
CREATE TABLE `job_batches`  (
  `id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `cancelled_at` int NULL DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_job_batches_created`(`created_at` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for jobs
-- ----------------------------
DROP TABLE IF EXISTS `jobs`;
CREATE TABLE `jobs`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint UNSIGNED NOT NULL,
  `reserved_at` int UNSIGNED NULL DEFAULT NULL,
  `available_at` int UNSIGNED NOT NULL,
  `created_at` int UNSIGNED NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_jobs_queue`(`queue` ASC) USING BTREE,
  INDEX `idx_jobs_available_at`(`available_at` ASC) USING BTREE,
  INDEX `idx_jobs_reserved_at`(`reserved_at` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for migrations
-- ----------------------------
DROP TABLE IF EXISTS `migrations`;
CREATE TABLE `migrations`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 44 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- DATABASE STRUCTURE SUMMARY
-- ============================================
-- 
-- CORE TABLES (38 total):
-- 
-- 1. GEOGRAPHIC HIERARCHY:
--    mas_provinces, mas_regencies, mas_cities, mas_villages
--    mas_river_basins, mas_watersheds, mas_upts, mas_uptds
-- 
-- 2. DEVICE & SENSOR SYSTEM:
--    mas_devices, mas_sensors, mas_device_parameters, mas_sensor_parameters
--    device_values, device_cctv, device_media, sensor_values
-- 
-- 3. FORECASTING & PREDICTION:
--    mas_models, mas_scalers
--    data_actuals, data_predictions
-- 
-- 4. DISCHARGE CALCULATION:
--    rating_curves, calculated_discharges, predicted_calculated_discharges
-- 
-- 5. DYNAMIC THRESHOLD SYSTEM:
--    mas_sensor_threshold_templates, mas_sensor_threshold_levels
--    mas_sensor_threshold_assignments
-- 
-- 6. GEOSPATIAL DATA:
--    geojson_files, geojson_mapping, mas_river_shape
-- 
-- 7. USER MANAGEMENT:
--    users, user_by_role, sessions, password_reset_tokens, personal_access_tokens
-- 
-- 8. SYSTEM TABLES:
--    cache, cache_locks, jobs, job_batches, failed_jobs, migrations
--    mas_whatsapp_numbers
-- 
-- ============================================
-- FIXES APPLIED IN THIS VERSION:
-- ============================================
-- 
-- 1. ✅ Fixed foreign key dependency order (users moved before device_media)
-- 2. ✅ Fixed threshold table drop order (moved to before mas_sensors)
-- 3. ✅ Added security comment for CCTV password encryption
-- 4. ✅ Added composite index for active threshold lookups
-- 5. ✅ Added composite index for sensor status queries
-- 6. ✅ Added clarifying comments for table purposes
-- 7. ✅ Documented naming convention inconsistencies
-- 8. ✅ Added notes about legacy threshold fields
-- 
-- ============================================
-- RECOMMENDED MAINTENANCE QUERIES
-- ============================================

-- Query to identify stale data (older than 1 year) for archival
-- SELECT COUNT(*) FROM data_actuals WHERE received_date < DATE_SUB(CURDATE(), INTERVAL 1 YEAR);

-- Query to find inactive sensors that haven't reported in 7 days
-- SELECT code, name, last_seen FROM mas_sensors WHERE last_seen < DATE_SUB(NOW(), INTERVAL 7 DAY);

-- Query to monitor table sizes
-- SELECT 
--   table_name, 
--   ROUND(((data_length + index_length) / 1024 / 1024), 2) AS "Size (MB)"
-- FROM information_schema.TABLES 
-- WHERE table_schema = 'ffws_v2'
-- ORDER BY (data_length + index_length) DESC;

-- Query to find active threshold assignments for a sensor
-- SELECT 
--   a.mas_sensor_code,
--   t.name AS template_name,
--   l.level_name,
--   l.min_value,
--   l.max_value,
--   l.severity
-- FROM mas_sensor_threshold_assignments a
-- JOIN mas_sensor_threshold_templates t ON a.threshold_template_code = t.code
-- JOIN mas_sensor_threshold_levels l ON t.code = l.threshold_template_code
-- WHERE a.mas_sensor_code = 'YOUR_SENSOR_CODE'
--   AND a.is_active = 1
--   AND CURDATE() BETWEEN a.effective_from AND COALESCE(a.effective_to, '9999-12-31')
-- ORDER BY l.level_order;

-- ============================================
-- PERFORMANCE RECOMMENDATIONS
-- ============================================
-- 
-- For production systems with millions of records, consider:
-- 
-- 1. PARTITIONING data_actuals by date:
--    ALTER TABLE data_actuals 
--    PARTITION BY RANGE (TO_DAYS(received_date)) (
--      PARTITION p2024 VALUES LESS THAN (TO_DAYS('2025-01-01')),
--      PARTITION p2025 VALUES LESS THAN (TO_DAYS('2026-01-01')),
--      PARTITION p_future VALUES LESS THAN MAXVALUE
--    );
-- 
-- 2. PARTITIONING data_predictions by date:
--    ALTER TABLE data_predictions 
--    PARTITION BY RANGE (TO_DAYS(prediction_for_ts)) (
--      PARTITION p2024 VALUES LESS THAN (TO_DAYS('2025-01-01')),
--      PARTITION p2025 VALUES LESS THAN (TO_DAYS('2026-01-01')),
--      PARTITION p_future VALUES LESS THAN MAXVALUE
--    );
-- 
-- 3. Regular index optimization:
--    ANALYZE TABLE data_actuals, data_predictions;
-- 
-- 4. Archive old data periodically (keep last 2 years in main tables)
-- 
-- ============================================
-- END OF DATABASE STRUCTURE
-- ============================================

