package main

import (
	"admin-back/handlers"
	"admin-back/middleware"
	"admin-back/store"
	"log"
	"net/http"
	"strings"
)

func main() {
	// Initialize store
	adSpotStore := store.NewInMemoryStore()

	// Initialize handlers
	handler := handlers.NewHandler(adSpotStore)

	// Setup router
	mux := http.NewServeMux()

	// Routes
	mux.HandleFunc("/adspots", middleware.CORS(func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case "POST":
			handler.CreateAdSpot(w, r)
		case "GET":
			handler.ListAdSpots(w, r)
		default:
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	}))

	mux.HandleFunc("/adspots/", middleware.CORS(func(w http.ResponseWriter, r *http.Request) {
		path := r.URL.Path

		if path == "/adspots/" {
			http.Error(w, "not found", http.StatusNotFound)
			return
		}

		if r.Method == "GET" && !strings.Contains(path[len("/adspots/"):], "/") {
			handler.GetAdSpot(w, r)
		} else if r.Method == "POST" && strings.HasSuffix(path, "/deactivate") {
			handler.DeactivateAdSpot(w, r)
		} else {
			http.Error(w, "not found", http.StatusNotFound)
		}
	}))

	// Start server
	log.Println("Server running on :8080")
	log.Fatal(http.ListenAndServe(":8080", mux))
}
