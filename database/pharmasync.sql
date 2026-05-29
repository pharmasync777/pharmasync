-- Database PharmaSync
-- Sistem Manajemen Persediaan Obat

CREATE DATABASE IF NOT EXISTS pharmasync;
USE pharmasync;

-- Tabel User
CREATE TABLE user (
    id_user INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    level VARCHAR(20) NOT NULL DEFAULT 'admin'
);

-- Tabel Obat
CREATE TABLE obat (
    id_obat INT PRIMARY KEY AUTO_INCREMENT,
    nama_obat VARCHAR(100) NOT NULL,
    jenis_obat VARCHAR(50) NOT NULL,
    stok INT NOT NULL DEFAULT 0,
    harga DECIMAL(10,2) NOT NULL,
    tanggal_exp DATE NOT NULL,
    stok_minimum INT DEFAULT 10
);

-- Tabel Supplier
CREATE TABLE supplier (
    id_supplier INT PRIMARY KEY AUTO_INCREMENT,
    nama_supplier VARCHAR(100) NOT NULL,
    alamat TEXT,
    no_telp VARCHAR(15)
);

-- Tabel Pasien
CREATE TABLE pasien (
    id_pasien INT PRIMARY KEY AUTO_INCREMENT,
    nama_pasien VARCHAR(100) NOT NULL,
    jenis_kelamin VARCHAR(20),
    alamat TEXT,
    no_telp VARCHAR(15)
);

-- Tabel Obat Masuk
CREATE TABLE obat_masuk (
    id_masuk INT PRIMARY KEY AUTO_INCREMENT,
    id_obat INT NOT NULL,
    id_supplier INT NOT NULL,
    id_user INT NOT NULL,
    jumlah_masuk INT NOT NULL,
    tanggal_masuk DATE NOT NULL,
    FOREIGN KEY (id_obat) REFERENCES obat(id_obat) ON DELETE CASCADE,
    FOREIGN KEY (id_supplier) REFERENCES supplier(id_supplier) ON DELETE CASCADE,
    FOREIGN KEY (id_user) REFERENCES user(id_user) ON DELETE CASCADE
);

-- Tabel Obat Keluar
CREATE TABLE obat_keluar (
    id_keluar INT PRIMARY KEY AUTO_INCREMENT,
    id_obat INT NOT NULL,
    id_user INT NOT NULL,
    id_transaksi INT,
    jumlah_keluar INT NOT NULL,
    tanggal_keluar DATE NOT NULL,
    FOREIGN KEY (id_obat) REFERENCES obat(id_obat) ON DELETE CASCADE,
    FOREIGN KEY (id_user) REFERENCES user(id_user) ON DELETE CASCADE
);

-- Tabel Transaksi
CREATE TABLE transaksi (
    id_transaksi INT PRIMARY KEY AUTO_INCREMENT,
    id_obat INT NOT NULL,
    id_user INT NOT NULL,
    id_pasien INT NOT NULL,
    tanggal_transaksi DATE NOT NULL,
    jumlah INT NOT NULL,
    total_harga DECIMAL(10,2),
    FOREIGN KEY (id_obat) REFERENCES obat(id_obat) ON DELETE CASCADE,
    FOREIGN KEY (id_user) REFERENCES user(id_user) ON DELETE CASCADE,
    FOREIGN KEY (id_pasien) REFERENCES pasien(id_pasien) ON DELETE CASCADE
);

-- CATATAN: Jangan insert user di sini.
-- Jalankan: node backend/scripts/createAdmin.js
-- untuk membuat user admin dengan password yang sudah di-hash bcrypt.

-- Insert data sample
INSERT INTO supplier (nama_supplier, alamat, no_telp) VALUES 
('PT Farma Sehat', 'Jakarta', '021-12345678');

INSERT INTO obat (nama_obat, jenis_obat, stok, harga, tanggal_exp, stok_minimum) VALUES 
('Paracetamol', 'Tablet', 120, 5000.00, '2027-12-31', 20);

INSERT INTO pasien (nama_pasien, jenis_kelamin, alamat, no_telp) VALUES 
('Reqa Adly', 'Laki-laki', 'Ds.mojo', '123456789101');
