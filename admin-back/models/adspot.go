package models

import "time"

type Placement string

const (
	PlacementHomeHero Placement = "HOME_HERO"
	PlacementSidebar  Placement = "SIDEBAR"
	PlacementFooter   Placement = "FOOTER"
	PlacementPopup    Placement = "POPUP"
)

type Status string

const (
	StatusActive   Status = "active"
	StatusInactive Status = "inactive"
)

type AdSpot struct {
	ID            string     `json:"id"`
	Title         string     `json:"title"`
	ImageURL      string     `json:"imageUrl"`
	Placement     Placement  `json:"placement"`
	TTLMinutes    int        `json:"ttlMinutes"`
	Status        Status     `json:"status"`
	CreatedAt     time.Time  `json:"createdAt"`
	DeactivatedAt *time.Time `json:"deactivatedAt,omitempty"`
}

type CreateAdSpotRequest struct {
	Title      string    `json:"title"`
	ImageURL   string    `json:"imageUrl"`
	Placement  Placement `json:"placement"`
	TTLMinutes int       `json:"ttlMinutes"`
}

type ListAdSpotsResponse struct {
	AdSpots []*AdSpot `json:"adSpots"`
	Total   int       `json:"total"`
}
