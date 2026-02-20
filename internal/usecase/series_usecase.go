package usecase

import (
    "errors"
    "movie_crud/internal/models"
    "movie_crud/internal/repository"
)

type SeriesUsecase interface {
    AddSeries(series *models.Media) error
    FetchAllSeries(limit, page int) ([]models.Media, int, error) // Return 3 nilai
    EditSeries(id int, series *models.Media) error
    RemoveSeries(id int) error
    SearchSeries(title string, genreID, limit, page int) ([]models.Media, int, error) // Return 3 nilai
    FetchSeriesByID(id int) (*models.Media, error)
}

type seriesUsecase struct {
    repo repository.SeriesRepository
}

func NewSeriesUsecase(r repository.SeriesRepository) SeriesUsecase {
    return &seriesUsecase{repo: r}
}

// 1. Perbaikan FetchAllSeries: Tambahkan parameter limit & page
func (u *seriesUsecase) FetchAllSeries(limit, page int) ([]models.Media, int, error) {
    if page < 1 { page = 1 }
    offset := (page - 1) * limit
    return u.repo.GetAll(limit, offset) // Repo mengembalikan (results, total, err)
}

// 2. Perbaikan SearchSeries: Sesuaikan parameter dengan Interface
func (u *seriesUsecase) SearchSeries(title string, genreID, limit, page int) ([]models.Media, int, error) {
    if page < 1 { page = 1 }
    offset := (page - 1) * limit
    // Gunakan u.repo.Search sesuai nama di Repository interface
    return u.repo.Search(title, genreID, limit, offset) 
}

func (u *seriesUsecase) AddSeries(s *models.Media) error {
    if s.Title == "" {
        return errors.New("series title cannot be empty")
    }
    s.Type = "series" 
    return u.repo.Create(s)
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