/*
 Navicat Premium Dump SQL

 Source Server         : localhost_3306
 Source Server Type    : MySQL
 Source Server Version : 90400 (9.4.0)
 Source Host           : localhost:3306
 Source Schema         : ffws_v2

 Target Server Type    : MySQL
 Target Server Version : 90400 (9.4.0)
 File Encoding         : 65001

 Date: 31/10/2025 09:23:57
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for cache
-- ----------------------------
DROP TABLE IF EXISTS `cache`;
CREATE TABLE `cache`  (
  `key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for cache_locks
-- ----------------------------
DROP TABLE IF EXISTS `cache_locks`;
CREATE TABLE `cache_locks`  (
  `key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for calculated_discharges
-- ----------------------------
DROP TABLE IF EXISTS `calculated_discharges`;
CREATE TABLE `calculated_discharges`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `mas_sensor_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `sensor_value` double NOT NULL,
  `sensor_discharge` double NOT NULL,
  `rating_curve_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `calculated_at` datetime NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uq_cd_sensor_ts`(`mas_sensor_code` ASC, `calculated_at` ASC) USING BTREE,
  INDEX `idx_cd_curve`(`rating_curve_code` ASC) USING BTREE,
  CONSTRAINT `fk_cd_curve_code` FOREIGN KEY (`rating_curve_code`) REFERENCES `rating_curves` (`code`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_cd_sensor_code` FOREIGN KEY (`mas_sensor_code`) REFERENCES `mas_sensors` (`code`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for data_actuals
-- ----------------------------
DROP TABLE IF EXISTS `data_actuals`;
CREATE TABLE `data_actuals`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `mas_sensor_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` double NOT NULL,
  `received_at` datetime NOT NULL,
  `threshold_status` enum('normal','watch','warning','danger','unknown') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'unknown',
  `received_date` date GENERATED ALWAYS AS (cast(`received_at` as date)) STORED NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uq_da_sensor_ts`(`mas_sensor_code` ASC, `received_at` ASC) USING BTREE,
  INDEX `data_actuals_received_at_index`(`received_at` ASC) USING BTREE,
  INDEX `idx_da_date`(`received_date` ASC) USING BTREE,
  CONSTRAINT `fk_da_sensor_code` FOREIGN KEY (`mas_sensor_code`) REFERENCES `mas_sensors` (`code`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for data_predictions
-- ----------------------------
DROP TABLE IF EXISTS `data_predictions`;
CREATE TABLE `data_predictions`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `mas_sensor_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `mas_model_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `prediction_run_at` datetime NOT NULL,
  `prediction_for_ts` datetime NOT NULL,
  `predicted_value` double NOT NULL,
  `confidence_score` double NULL DEFAULT NULL,
  `threshold_prediction_status` enum('normal','watch','warning','danger','unknown') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'unknown',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uq_dp_sensor_t_model`(`mas_sensor_code` ASC, `prediction_for_ts` ASC, `mas_model_code` ASC) USING BTREE,
  INDEX `data_predictions_prediction_run_at_index`(`prediction_run_at` ASC) USING BTREE,
  INDEX `idx_dp_sensor_ts`(`mas_sensor_code` ASC, `prediction_for_ts` ASC) USING BTREE,
  INDEX `idx_dp_model`(`mas_model_code` ASC, `prediction_run_at` ASC) USING BTREE,
  CONSTRAINT `fk_dp_model_code` FOREIGN KEY (`mas_model_code`) REFERENCES `mas_models` (`code`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_dp_sensor_code` FOREIGN KEY (`mas_sensor_code`) REFERENCES `mas_sensors` (`code`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for device_values
-- ----------------------------
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
  `elevation` double NULL DEFAULT NULL,
  `status` enum('active','inactive','pending') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_dev_rbasin`(`mas_river_basin_code` ASC) USING BTREE,
  INDEX `idx_dev_watershed`(`mas_watershed_code` ASC) USING BTREE,
  INDEX `idx_dev_city`(`mas_city_code` ASC) USING BTREE,
  INDEX `idx_dev_regency`(`mas_regency_code` ASC) USING BTREE,
  INDEX `idx_dev_village`(`mas_village_code` ASC) USING BTREE,
  INDEX `idx_dev_upt`(`mas_upt_code` ASC) USING BTREE,
  INDEX `idx_dev_uptd`(`mas_uptd_code` ASC) USING BTREE,
  INDEX `idx_dev_param`(`mas_device_parameter_code` ASC) USING BTREE,
  INDEX `fk_dv_device_code`(`mas_device_code` ASC) USING BTREE,
  CONSTRAINT `fk_dv_city_code` FOREIGN KEY (`mas_city_code`) REFERENCES `mas_cities` (`code`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_dv_device_code` FOREIGN KEY (`mas_device_code`) REFERENCES `mas_devices` (`code`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_dv_device_param` FOREIGN KEY (`mas_device_parameter_code`) REFERENCES `mas_device_parameters` (`code`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_dv_rbasin_code` FOREIGN KEY (`mas_river_basin_code`) REFERENCES `mas_river_basins` (`code`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_dv_regency_code` FOREIGN KEY (`mas_regency_code`) REFERENCES `mas_regencies` (`regencies_code`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_dv_upt_code` FOREIGN KEY (`mas_upt_code`) REFERENCES `mas_upts` (`code`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_dv_uptd_code` FOREIGN KEY (`mas_uptd_code`) REFERENCES `mas_uptds` (`code`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_dv_village_code` FOREIGN KEY (`mas_village_code`) REFERENCES `mas_villages` (`code`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_dv_ws_code` FOREIGN KEY (`mas_watershed_code`) REFERENCES `mas_watersheds` (`code`) ON DELETE SET NULL ON UPDATE CASCADE
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
  UNIQUE INDEX `failed_jobs_uuid_unique`(`uuid` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for geojson_files
-- ----------------------------
DROP TABLE IF EXISTS `geojson_files`;
CREATE TABLE `geojson_files`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `original_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `stored_path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `disk` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'local',
  `size` bigint UNSIGNED NULL DEFAULT NULL,
  `mime_type` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `sha256` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `label` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `geojson_files_label_index`(`label` ASC) USING BTREE,
  INDEX `geojson_files_sha256_index`(`sha256` ASC) USING BTREE
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
  `value_min` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `value_max` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `file_path` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `version` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `description` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `properties_content` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `geojson_mapping_geojson_code_unique`(`geojson_code` ASC) USING BTREE,
  INDEX `idx_gm_device`(`mas_device_code` ASC) USING BTREE,
  INDEX `idx_gm_territory`(`mas_river_basin_code` ASC, `mas_watershed_code` ASC, `mas_city_code` ASC, `mas_regency_code` ASC, `mas_village_code` ASC) USING BTREE,
  INDEX `fk_gm_ws_code`(`mas_watershed_code` ASC) USING BTREE,
  INDEX `fk_gm_city_code`(`mas_city_code` ASC) USING BTREE,
  INDEX `fk_gm_regency_code`(`mas_regency_code` ASC) USING BTREE,
  INDEX `fk_gm_village_code`(`mas_village_code` ASC) USING BTREE,
  INDEX `fk_gm_upt_code`(`mas_upt_code` ASC) USING BTREE,
  INDEX `fk_gm_uptd_code`(`mas_uptd_code` ASC) USING BTREE,
  INDEX `fk_gm_device_param`(`mas_device_parameter_code` ASC) USING BTREE,
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
  PRIMARY KEY (`id`) USING BTREE
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
  INDEX `jobs_queue_index`(`queue` ASC) USING BTREE
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
  UNIQUE INDEX `mas_cities_cities_code_unique`(`code` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

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
  UNIQUE INDEX `mas_device_parameters_code_unique`(`code` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for mas_devices
-- ----------------------------
DROP TABLE IF EXISTS `mas_devices`;
CREATE TABLE `mas_devices`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `mas_river_basin_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `latitude` double NOT NULL,
  `longitude` double NOT NULL,
  `elevation_m` double NOT NULL,
  `status` enum('active','inactive') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `mas_devices_code_unique`(`code` ASC) USING BTREE,
  INDEX `fk_md_basin_code`(`mas_river_basin_code` ASC) USING BTREE,
  CONSTRAINT `fk_md_basin_code` FOREIGN KEY (`mas_river_basin_code`) REFERENCES `mas_river_basins` (`code`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 88 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for mas_models
-- ----------------------------
DROP TABLE IF EXISTS `mas_models`;
CREATE TABLE `mas_models`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `version` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `file_path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `n_steps_in` tinyint NULL DEFAULT NULL,
  `n_steps_out` tinyint NULL DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `mas_models_model_code_unique`(`code` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for mas_provinces
-- ----------------------------
DROP TABLE IF EXISTS `mas_provinces`;
CREATE TABLE `mas_provinces`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `provinces_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `provinces_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `mas_provinces_provinces_code_unique`(`provinces_code` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for mas_regencies
-- ----------------------------
DROP TABLE IF EXISTS `mas_regencies`;
CREATE TABLE `mas_regencies`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `regencies_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `regencies_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `mas_regencies_regencies_code_unique`(`regencies_code` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for mas_river_basins
-- ----------------------------
DROP TABLE IF EXISTS `mas_river_basins`;
CREATE TABLE `mas_river_basins`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `cities_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `mas_river_basins_code_unique`(`code` ASC) USING BTREE,
  INDEX `fk_rbasin_city_code`(`cities_code` ASC) USING BTREE,
  CONSTRAINT `fk_rbasin_city_code` FOREIGN KEY (`cities_code`) REFERENCES `mas_cities` (`code`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 14 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for mas_river_shape
-- ----------------------------
DROP TABLE IF EXISTS `mas_river_shape`;
CREATE TABLE `mas_river_shape`  (
  `id` int NOT NULL,
  `code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `sensor_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `array_codes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `x` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `y` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `a` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `b` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `c` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for mas_scalers
-- ----------------------------
DROP TABLE IF EXISTS `mas_scalers`;
CREATE TABLE `mas_scalers`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `mas_model_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `mas_sensor_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `io_axis` enum('x','y') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `technique` enum('standard','minmax','robust','custom') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'custom',
  `version` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `file_path` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_hash_sha256` char(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `mas_scalers_scaler_code_unique`(`code` ASC) USING BTREE,
  UNIQUE INDEX `uk_model_sensor_axis_active`(`mas_model_code` ASC, `mas_sensor_code` ASC, `io_axis` ASC, `is_active` ASC) USING BTREE,
  INDEX `idx_ms_sensor_code`(`mas_sensor_code` ASC) USING BTREE,
  INDEX `fk_scaler_model_code`(`mas_model_code` ASC) USING BTREE,
  CONSTRAINT `fk_scaler_model_code` FOREIGN KEY (`mas_model_code`) REFERENCES `mas_models` (`code`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_scaler_sensor_code` FOREIGN KEY (`mas_sensor_code`) REFERENCES `mas_sensors` (`code`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

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
  UNIQUE INDEX `mas_sensor_parameters_code_unique`(`code` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for mas_sensor_thresholds
-- ----------------------------
DROP TABLE IF EXISTS `mas_sensor_thresholds`;
CREATE TABLE `mas_sensor_thresholds`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `sensor_thresholds_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `sensor_thresholds_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `sensor_thresholds_value_1` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `sensor_thresholds_value_1_color` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `sensor_thresholds_value_2` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `sensor_thresholds_value_2_color` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `sensor_thresholds_value_3` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `sensor_thresholds_value_3_color` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `sensor_thresholds_value_4` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `sensor_thresholds_value_4_color` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `mas_sensor_thresholds_sensor_thresholds_code_unique`(`sensor_thresholds_code` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for mas_sensors
-- ----------------------------
DROP TABLE IF EXISTS `mas_sensors`;
CREATE TABLE `mas_sensors`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `device_code` bigint UNSIGNED NOT NULL,
  `mas_device_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `parameter` enum('water_level','rainfall') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `unit` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `mas_model_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `threshold_safe` double NULL DEFAULT NULL,
  `threshold_warning` double NULL DEFAULT NULL,
  `threshold_danger` double NULL DEFAULT NULL,
  `status` enum('active','inactive') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `forecasting_status` enum('stopped','running','paused') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'stopped',
  `is_active` tinyint(1) NULL DEFAULT NULL,
  `last_seen` datetime NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `mas_sensors_sensor_code_unique`(`code` ASC) USING BTREE,
  INDEX `mas_sensors_mas_model_code_foreign`(`mas_model_code` ASC) USING BTREE,
  INDEX `fk_sensor_device_code`(`mas_device_code` ASC) USING BTREE,
  CONSTRAINT `fk_sensor_device_code` FOREIGN KEY (`mas_device_code`) REFERENCES `mas_devices` (`code`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_sensor_model_code` FOREIGN KEY (`mas_model_code`) REFERENCES `mas_models` (`code`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 80 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

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
  UNIQUE INDEX `mas_uptds_code_unique`(`code` ASC) USING BTREE,
  INDEX `fk_uptd_upt_code`(`upt_code` ASC) USING BTREE,
  CONSTRAINT `fk_uptd_upt_code` FOREIGN KEY (`upt_code`) REFERENCES `mas_upts` (`code`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

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
  UNIQUE INDEX `mas_upts_upts_code_unique`(`code` ASC) USING BTREE,
  INDEX `fk_upt_basin_code`(`river_basin_code` ASC) USING BTREE,
  INDEX `fk_upt_city_code`(`cities_code` ASC) USING BTREE,
  CONSTRAINT `fk_upt_basin_code` FOREIGN KEY (`river_basin_code`) REFERENCES `mas_river_basins` (`code`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_upt_city_code` FOREIGN KEY (`cities_code`) REFERENCES `mas_cities` (`code`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

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
  UNIQUE INDEX `mas_villages_villages_code_unique`(`code` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

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
  UNIQUE INDEX `mas_watersheds_watersheds_code_unique`(`code` ASC) USING BTREE,
  INDEX `fk_ws_basin_code`(`river_basin_code` ASC) USING BTREE,
  CONSTRAINT `fk_ws_basin_code` FOREIGN KEY (`river_basin_code`) REFERENCES `mas_river_basins` (`code`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for mas_whatsapp_numbers
-- ----------------------------
DROP TABLE IF EXISTS `mas_whatsapp_numbers`;
CREATE TABLE `mas_whatsapp_numbers`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `number` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
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

-- ----------------------------
-- Table structure for password_reset_tokens
-- ----------------------------
DROP TABLE IF EXISTS `password_reset_tokens`;
CREATE TABLE `password_reset_tokens`  (
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`) USING BTREE,
  CONSTRAINT `fk_prt_users_email` FOREIGN KEY (`email`) REFERENCES `users` (`email`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for personal_access_tokens
-- ----------------------------
DROP TABLE IF EXISTS `personal_access_tokens`;
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
  UNIQUE INDEX `personal_access_tokens_token_unique`(`token` ASC) USING BTREE,
  INDEX `personal_access_tokens_tokenable_type_tokenable_id_index`(`tokenable_type` ASC, `tokenable_id` ASC) USING BTREE,
  INDEX `personal_access_tokens_expires_at_index`(`expires_at` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for predicted_calculated_discharges
-- ----------------------------
DROP TABLE IF EXISTS `predicted_calculated_discharges`;
CREATE TABLE `predicted_calculated_discharges`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `mas_sensor_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `predicted_value` double NOT NULL,
  `predicted_discharge` double NOT NULL,
  `rating_curve_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `calculated_at` datetime NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uq_pcd_sensor_ts`(`mas_sensor_code` ASC, `calculated_at` ASC) USING BTREE,
  INDEX `idx_pcd_curve`(`rating_curve_code` ASC) USING BTREE,
  CONSTRAINT `fk_pcd_curve_code` FOREIGN KEY (`rating_curve_code`) REFERENCES `rating_curves` (`code`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_pcd_sensor_code` FOREIGN KEY (`mas_sensor_code`) REFERENCES `mas_sensors` (`code`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for rating_curves
-- ----------------------------
DROP TABLE IF EXISTS `rating_curves`;
CREATE TABLE `rating_curves`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `mas_sensor_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `formula_type` enum('power','polynomial','exponential','custom') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `a` double NOT NULL,
  `b` double NULL DEFAULT NULL,
  `c` double NULL DEFAULT NULL,
  `effective_date` date NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_rating_curves_code`(`code` ASC) USING BTREE,
  INDEX `idx_rc_sensor`(`mas_sensor_code` ASC, `effective_date` ASC) USING BTREE,
  CONSTRAINT `fk_rc_sensor_code` FOREIGN KEY (`mas_sensor_code`) REFERENCES `mas_sensors` (`code`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for sensor_values
-- ----------------------------
DROP TABLE IF EXISTS `sensor_values`;
CREATE TABLE `sensor_values`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `mas_sensor_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `mas_sensor_parameter_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `mas_sensor_threshold_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `sensor_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `sensor_unit` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `sensor_description` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `sensor_icon_path` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `status` enum('active','inactive','fault') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `last_seen` datetime NULL DEFAULT NULL,
  `is_active` tinyint(1) NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_sv_param`(`mas_sensor_parameter_code` ASC) USING BTREE,
  INDEX `idx_sv_threshold`(`mas_sensor_threshold_code` ASC) USING BTREE,
  INDEX `fk_sv_sensor_code`(`mas_sensor_code` ASC) USING BTREE,
  CONSTRAINT `fk_sv_param_code` FOREIGN KEY (`mas_sensor_parameter_code`) REFERENCES `mas_sensor_parameters` (`code`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_sv_sensor_code` FOREIGN KEY (`mas_sensor_code`) REFERENCES `mas_sensors` (`code`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_sv_threshold_code` FOREIGN KEY (`mas_sensor_threshold_code`) REFERENCES `mas_sensor_thresholds` (`sensor_thresholds_code`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for sessions
-- ----------------------------
DROP TABLE IF EXISTS `sessions`;
CREATE TABLE `sessions`  (
  `id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint UNSIGNED NULL DEFAULT NULL,
  `ip_address` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `user_agent` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `sessions_user_id_index`(`user_id` ASC) USING BTREE,
  INDEX `sessions_last_activity_index`(`last_activity` ASC) USING BTREE,
  CONSTRAINT `fk_sessions_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

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
  UNIQUE INDEX `user_by_role_upt_code_unique`(`upt_code` ASC) USING BTREE,
  CONSTRAINT `fk_ubr_upt_code` FOREIGN KEY (`upt_code`) REFERENCES `mas_upts` (`code`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for users
-- ----------------------------
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
  UNIQUE INDEX `users_email_unique`(`email` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

SET FOREIGN_KEY_CHECKS = 1;
