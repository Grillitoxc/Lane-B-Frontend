package store

import (
	"admin-back/models"
	"sync"
	"time"

	"github.com/google/uuid"
)

type Store interface {
	Create(title, imageURL string, placement models.Placement, ttlMinutes int) *models.AdSpot
	Get(id string) *models.AdSpot
	Deactivate(id string) (*models.AdSpot, bool)
	ListActive(placement string) []*models.AdSpot
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

	if ttlMinutes == 0 {
		ttlMinutes = 60
	}

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

func (s *InMemoryStore) ListActive(placement string) []*models.AdSpot {
	s.mu.RLock()
	defer s.mu.RUnlock()

	result := []*models.AdSpot{}
	now := time.Now()

	for _, ad := range s.adspots {
		if ad.Status != models.StatusActive {
			continue
		}

		expiresAt := ad.CreatedAt.Add(time.Duration(ad.TTLMinutes) * time.Minute)
		if now.After(expiresAt) {
			continue
		}

		if placement != "" && string(ad.Placement) != placement {
			continue
		}

		result = append(result, ad)
	}

	return result
}
