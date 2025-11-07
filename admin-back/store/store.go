package store

import (
	"admin-back/models"
	"sort"
	"sync"
	"time"

	"github.com/google/uuid"
)

type Store interface {
	Create(title, imageURL string, placement models.Placement, ttlMinutes int) *models.AdSpot
	Get(id string) *models.AdSpot
	Deactivate(id string) (*models.AdSpot, bool)
	ListActive(placement, search string) []*models.AdSpot
}

type InMemoryStore struct {
	mu      sync.RWMutex
	adspots map[string]*models.AdSpot
}

func NewInMemoryStore() *InMemoryStore {
	return &InMemoryStore{
		adspots: make(map[string]*models.AdSpot),
	}
}

func (s *InMemoryStore) Create(title, imageURL string, placement models.Placement, ttlMinutes int) *models.AdSpot {
	s.mu.Lock()
	defer s.mu.Unlock()

	ad := &models.AdSpot{
		ID:         uuid.New().String(),
		Title:      title,
		ImageURL:   imageURL,
		Placement:  placement,
		TTLMinutes: ttlMinutes,
		Status:     models.StatusActive,
		CreatedAt:  time.Now(),
	}

	s.adspots[ad.ID] = ad
	return ad
}

func (s *InMemoryStore) Get(id string) *models.AdSpot {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return s.adspots[id]
}

func (s *InMemoryStore) Deactivate(id string) (*models.AdSpot, bool) {
	s.mu.Lock()
	defer s.mu.Unlock()

	ad, exists := s.adspots[id]
	if !exists {
		return nil, false
	}

	now := time.Now()
	ad.Status = models.StatusInactive
	ad.DeactivatedAt = &now
	return ad, true
}

func (s *InMemoryStore) ListActive(placement, search string) []*models.AdSpot {
	s.mu.RLock()
	defer s.mu.RUnlock()

	result := []*models.AdSpot{}
	now := time.Now()

	for _, ad := range s.adspots {
		if ad.Status != models.StatusActive {
			continue
		}

		// Only check TTL if it's set (> 0)
		if ad.TTLMinutes > 0 {
			expiresAt := ad.CreatedAt.Add(time.Duration(ad.TTLMinutes) * time.Minute)
			if now.After(expiresAt) {
				continue
			}
		}

		if placement != "" && string(ad.Placement) != placement {
			continue
		}

		if search != "" && !containsIgnoreCase(ad.Title, search) {
			continue
		}

		result = append(result, ad)
	}

	// Sort by CreatedAt descending (most recent first)
	sort.Slice(result, func(i, j int) bool {
		return result[i].CreatedAt.After(result[j].CreatedAt)
	})

	return result
}

func containsIgnoreCase(str, substr string) bool {
	return len(str) >= len(substr) &&
		(str == substr ||
		 len(substr) == 0 ||
		 findSubstring(toLower(str), toLower(substr)))
}

func toLower(s string) string {
	result := make([]rune, len(s))
	for i, r := range s {
		if r >= 'A' && r <= 'Z' {
			result[i] = r + 32
		} else {
			result[i] = r
		}
	}
	return string(result)
}

func findSubstring(str, substr string) bool {
	if len(substr) == 0 {
		return true
	}
	if len(str) < len(substr) {
		return false
	}
	for i := 0; i <= len(str)-len(substr); i++ {
		if str[i:i+len(substr)] == substr {
			return true
		}
	}
	return false
}
