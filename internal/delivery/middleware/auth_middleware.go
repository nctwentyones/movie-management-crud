package middleware

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt/v5" // Pastikan sudah diinstall
)

// Ganti dengan Secret Key atau Public Key dari Keycloak/Provider kamu
var jwtKey = []byte("your_secret_key")

func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// 1. Ambil token dari header "Authorization: Bearer <token>"
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "Authorization header is required", http.StatusUnauthorized)
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")

		// 2. Validasi Token
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return jwtKey, nil
		})

		if err != nil || !token.Valid {
			http.Error(w, "Invalid or expired token", http.StatusUnauthorized)
			return
		}

		// 3. Cek Role (Opsional jika ingin proteksi level Admin)
		claims, ok := token.Claims.(jwt.MapClaims)
		if ok && token.Valid {
			role := claims["role"].(string)
			if role != "admin" {
				// Izinkan GET untuk semua, tapi proteksi POST/PUT/DELETE
				if r.Method != http.MethodGet {
					http.Error(w, "Forbidden: Admin access only", http.StatusForbidden)
					return
				}
			}
		}

		next.ServeHTTP(w, r)
	})
}