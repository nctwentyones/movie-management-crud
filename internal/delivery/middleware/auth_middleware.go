package middleware

import (
	"context"
	"net/http"
	"strings"

	"github.com/coreos/go-oidc/v3/oidc"
)

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

		ctx := context.Background()
		provider, err := oidc.NewProvider(ctx, "http://localhost:8443/realms/movie-realm")
		if err != nil {
			http.Error(w, "Failed to connect to Keycloak", http.StatusInternalServerError)
			return
		}

		oidcConfig := &oidc.Config{
			ClientID: "movie-frontend",
		}
		verifier := provider.Verifier(oidcConfig)

		idToken, err := verifier.Verify(ctx, tokenString)
		if err != nil {
			http.Error(w, "Invalid or expired token: "+err.Error(), http.StatusUnauthorized)
			return
		}

		var claims struct {
			PreferredUsername string   `json:"preferred_username"`
			Roles             []string `json:"roles"`
		}
		if err := idToken.Claims(&claims); err != nil {
			http.Error(w, "Failed to parse claims", http.StatusInternalServerError)
			return
		}

		next.ServeHTTP(w, r)
	})
}