package middleware

import (
	"context"
	"log"
	"net/http"
	"strings"

	"github.com/coreos/go-oidc/v3/oidc"
)

var verifier *oidc.IDTokenVerifier

func InitOIDC() {
	ctx := context.Background()

	provider, err := oidc.NewProvider(ctx, "http://localhost:8080/realms/movie-realm")
	if err != nil {
		log.Fatalf("Failed to connect to Keycloak: %v", err)
	}

	verifier = provider.Verifier(&oidc.Config{
		ClientID: "movie-frontend",
	})
}

func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "Authorization header is required", http.StatusUnauthorized)
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			http.Error(w, "Invalid authorization format", http.StatusUnauthorized)
			return
		}

		tokenString := parts[1]

		ctx := r.Context()

		idToken, err := verifier.Verify(ctx, tokenString)
		if err != nil {
			log.Println("Token verification failed:", err)
			http.Error(w, "Invalid or expired token", http.StatusUnauthorized)
			return
		}

		var claims struct {
			PreferredUsername string `json:"preferred_username"`
			RealmAccess struct {
				Roles []string `json:"roles"`
			} `json:"realm_access"`
		}

		if err := idToken.Claims(&claims); err != nil {
			log.Println("Failed to parse claims:", err)
			http.Error(w, "Failed to parse token claims", http.StatusInternalServerError)
			return
		}

		log.Println("User:", claims.PreferredUsername)
		log.Println("Roles:", claims.RealmAccess.Roles)

		next.ServeHTTP(w, r)
	})
}
