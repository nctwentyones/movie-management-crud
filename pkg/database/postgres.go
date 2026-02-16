package database

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/lib/pq"
)

func InitDB() *sql.DB {
	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	dbname := os.Getenv("DB_NAME")

	dsn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname)

	db, err := sql.Open("postgres", dsn)
	if err != nil {
		log.Fatalf("Gagal menyambung ke database: %v", err)
	}

	err = db.Ping()
	if err != nil {
		log.Fatalf("Database tidak merespon: %v", err)
	}

	query := `
	CREATE TABLE IF NOT EXISTS medias (
		id SERIAL PRIMARY KEY,
		type VARCHAR(10) NOT NULL,
		title VARCHAR(255) NOT NULL,
		year INTEGER,
		director VARCHAR(255),
		genre VARCHAR(100),
		poster_url TEXT,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);`

	_, err = db.Exec(query)
	if err != nil {
		log.Fatalf("Gagal membuat tabel otomatis: %v", err)
	}

	log.Println("Berhasil terhubung ke database dan tabel telah diverifikasi!")
	return db
}
