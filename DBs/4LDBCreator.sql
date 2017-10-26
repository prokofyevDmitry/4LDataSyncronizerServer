-- MySQL Script generated by MySQL Workbench
-- jeu. 26 oct. 2017 16:46:27 CEST
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema 4LDB
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `4LDB` ;

-- -----------------------------------------------------
-- Schema 4LDB
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `4LDB` DEFAULT CHARACTER SET utf8 ;
USE `4LDB` ;

-- -----------------------------------------------------
-- Table `4LDB`.`etape`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `4LDB`.`etape` ;

CREATE TABLE IF NOT EXISTS `4LDB`.`etape` (
  `idetape` INT NOT NULL AUTO_INCREMENT,
  `numéro` INT NULL,
  `arrivee` VARCHAR(45) NULL,
  `depart` VARCHAR(45) NULL,
  `time` TIMESTAMP(0) NULL DEFAULT NOW(),
  `time_arrivee` TIMESTAMP(0) NULL,
  `time_depart` TIMESTAMP(0) NULL,
  PRIMARY KEY (`idetape`),
  UNIQUE INDEX `arrivee_UNIQUE` (`arrivee` ASC),
  UNIQUE INDEX `depart_UNIQUE` (`depart` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `4LDB`.`pointgps`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `4LDB`.`pointgps` ;

CREATE TABLE IF NOT EXISTS `4LDB`.`pointgps` (
  `lattitude` FLOAT NULL,
  `idpointgps` INT NOT NULL AUTO_INCREMENT,
  `longitude` FLOAT NULL,
  `vitesse` FLOAT NULL,
  `roll` FLOAT NULL,
  `magx` FLOAT NULL,
  `altitude` FLOAT NULL,
  `etape_idetape` INT NOT NULL,
  `time` TIMESTAMP(0) NULL DEFAULT NOW(),
  `pitch` FLOAT NULL,
  PRIMARY KEY (`idpointgps`),
  INDEX `fk_pointgps_etape1_idx` (`etape_idetape` ASC),
  CONSTRAINT `fk_pointgps_etape1`
    FOREIGN KEY (`etape_idetape`)
    REFERENCES `4LDB`.`etape` (`idetape`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `4LDB`.`image`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `4LDB`.`image` ;

CREATE TABLE IF NOT EXISTS `4LDB`.`image` (
  `idimage` INT NOT NULL AUTO_INCREMENT,
  `time` TIMESTAMP(0) NULL DEFAULT NOW(),
  `etape_idetape1` INT NOT NULL,
  `pointgps_idpointgps` INT NOT NULL,
  `path` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`idimage`),
  UNIQUE INDEX `date_UNIQUE` (`time` ASC),
  INDEX `fk_image_etape1_idx` (`etape_idetape1` ASC),
  INDEX `fk_image_pointgps1_idx` (`pointgps_idpointgps` ASC),
  CONSTRAINT `fk_image_etape1`
    FOREIGN KEY (`etape_idetape1`)
    REFERENCES `4LDB`.`etape` (`idetape`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_image_pointgps1`
    FOREIGN KEY (`pointgps_idpointgps`)
    REFERENCES `4LDB`.`pointgps` (`idpointgps`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `4LDB`.`messageAWS`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `4LDB`.`messageAWS` ;

CREATE TABLE IF NOT EXISTS `4LDB`.`messageAWS` (
  `idmessageAWS` INT NOT NULL AUTO_INCREMENT,
  `corpus` VARCHAR(156) NULL,
  `pseudo` VARCHAR(156) NULL,
  `time` TIMESTAMP(0) NULL DEFAULT NOW(),
  PRIMARY KEY (`idmessageAWS`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `4LDB`.`message4L`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `4LDB`.`message4L` ;

CREATE TABLE IF NOT EXISTS `4LDB`.`message4L` (
  `idmessage4L` INT NOT NULL AUTO_INCREMENT,
  `corpus` VARCHAR(45) NULL,
  `time` TIMESTAMP(0) NULL DEFAULT NOW(),
  PRIMARY KEY (`idmessage4L`))
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
