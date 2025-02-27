CREATE DATABASE IF NOT EXISTS SAMUL;
USE SAMUL;

CREATE TABLE IF NOT EXISTS lockers (
    id VARCHAR(36) PRIMARY KEY,
    number INT NOT NULL,
    row_pos INT NOT NULL,
    col_pos INT NOT NULL,
    status ENUM('available', 'occupied') DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    locker_id VARCHAR(36) UNIQUE,
    name VARCHAR(50) NOT NULL,
    student_id VARCHAR(20),
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (locker_id) REFERENCES lockers(id) ON DELETE SET NULL
); 