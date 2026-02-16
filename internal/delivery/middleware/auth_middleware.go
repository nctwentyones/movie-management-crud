package middleware

import (
	"context"
	"net/http"
	"strings"

	"github.com/coreos/go-oidc/v3/oidc"
)

func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// 1. Ambil token dari header Authorization
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "Authorization header is required", http.StatusUnauthorized)
			return
		}

		// 2. Format harus "Bearer <token>"
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			http.Error(w, "Invalid authorization format", http.StatusUnauthorized)
			return
		}

		tokenString := parts[1]

		// 3. Konfigurasi OIDC Provider (Keycloak)
		// Sesuaikan URL, Realm, dan ClientID dengan yang ada di AuthContext.tsx
		ctx := context.Background()
		provider, err := oidc.NewProvider(ctx, "http://localhost:8443/realms/your-realm")
		if err != nil {
			http.Error(w, "Failed to connect to Keycloak", http.StatusInternalServerError)
			return
		}

		// 4. Verifikasi Token
		oidcConfig := &oidc.Config{
			ClientID: "your-client-id",
		}
		verifier := provider.Verifier(oidcConfig)

		idToken, err := verifier.Verify(ctx, tokenString)
		if err != nil {
			http.Error(w, "Invalid or expired token: "+err.Error(), http.StatusUnauthorized)
			return
		}

		// (Opsional) Ambil klaim seperti username atau role jika dibutuhkan
		var claims struct {
			PreferredUsername string   `json:"preferred_username"`
			Roles             []string `json:"roles"`
		}
		if err := idToken.Claims(&claims); err != nil {
			http.Error(w, "Failed to parse claims", http.StatusInternalServerError)
			return
		}

		// Lanjutkan request jika token valid
		next.ServeHTTP(w, r)
	})
}