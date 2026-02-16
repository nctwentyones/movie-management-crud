package usecase

import (
	"errors"
	"movie_crud/internal/models"
	"movie_crud/internal/repository"
)

type SeriesUsecase interface {
	AddSeries(series *models.Media) error
	FetchAllSeries() ([]models.Media, error)
	EditSeries(id int, series *models.Media) error
	RemoveSeries(id int) error
	SearchSeries(title string) ([]models.Media, error)
	FetchSeriesByID(id int) (*models.Media, error)
}

type seriesUsecase struct {
	repo repository.SeriesRepository
}

func NewSeriesUsecase(r repository.SeriesRepository) SeriesUsecase {
	return &seriesUsecase{repo: r}
}

func (u *seriesUsecase) AddSeries(s *models.Media) error {
	if s.Title == "" {
		return errors.New("series title cannot be empty")
	}
	return u.repo.Create(s)
}

func (u *seriesUsecase) FetchAllSeries() ([]models.Media, error) {
	return u.repo.GetAll()
}

func (u *seriesUsecase) FetchSeriesByID(id int) (*models.Media, error) {
	return u.repo.GetByID(id)
}

func (u *seriesUsecase) EditSeries(id int, s *models.Media) error {
	return u.repo.Update(id, s)
}

func (u *seriesUsecase) RemoveSeries(id int) error {
	return u.repo.Delete(id)
}

func (u *seriesUsecase) SearchSeries(title string) ([]models.Media, error) {
	return u.repo.SearchByTitle(title)
}