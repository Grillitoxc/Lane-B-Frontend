package handlers

import (
	"admin-back/models"
	"admin-back/store"
	"encoding/json"
	"net/http"
	"strings"
)

type Handler struct {
	store store.Store
}

func NewHandler(s store.Store) *Handler {
	return &Handler{store: s}
}

func (h *Handler) CreateAdSpot(w http.ResponseWriter, r *http.Request) {
	var req models.CreateAdSpotRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	ad := h.store.Create(req.Title, req.ImageURL, req.Placement, req.TTLMinutes)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(ad)
}

func (h *Handler) GetAdSpot(w http.ResponseWriter, r *http.Request) {
	id := strings.TrimPrefix(r.URL.Path, "/adspots/")

	ad := h.store.Get(id)
	if ad == nil {
		http.Error(w, "not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(ad)
}

func (h *Handler) DeactivateAdSpot(w http.ResponseWriter, r *http.Request) {
	path := r.URL.Path
	id := path[len("/adspots/") : len(path)-len("/deactivate")]

	ad, ok := h.store.Deactivate(id)
	if !ok {
		http.Error(w, "not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(ad)
}

func (h *Handler) ListAdSpots(w http.ResponseWriter, r *http.Request) {
	placement := r.URL.Query().Get("placement")
	status := r.URL.Query().Get("status")
	search := r.URL.Query().Get("search")

	if status != "" && status != "active" {
		http.Error(w, "only status=active is supported", http.StatusBadRequest)
		return
	}

	ads := h.store.ListActive(placement, search)

	response := models.ListAdSpotsResponse{
		AdSpots: ads,
		Total:   len(ads),
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
