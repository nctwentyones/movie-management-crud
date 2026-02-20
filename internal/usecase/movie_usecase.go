package usecase

import (
	"errors"
	"movie_crud/internal/models"
	"movie_crud/internal/repository"
)

type MovieUsecase interface {
	AddMovie(movie *models.Media) error
	FetchAllMovies(limit, page int) ([]models.Media, int, error)
	EditMovie(id int, movie *models.Media) error
	RemoveMovie(id int) error
	SearchMovies(title string, genreID, limit, page int) ([]models.Media, int, error)
	SearchMoviesByID(id int) (*models.Media, error)
}

type movieUsecase struct {
	repo repository.MovieRepository
}

func NewMovieUsecase(r repository.MovieRepository) MovieUsecase {
	return &movieUsecase{repo: r}
}

func (u *movieUsecase) SearchMoviesByID(id int) (*models.Media, error) {
	return u.repo.GetByID(id)
}

func (u *movieUsecase) AddMovie(m *models.Media) error {
	if m.Title == "" {
		return errors.New("title is required")
	}
	return u.repo.Create(m)
}

func (u *movieUsecase) FetchAllMovies(limit, page int) ([]models.Media, int, error) {
	offset := (page - 1) * limit
	return u.repo.GetAll(limit, offset)
}

func (u *movieUsecase) EditMovie(id int, m *models.Media) error {
	return u.repo.Update(id, m)
}

func (u *movieUsecase) RemoveMovie(id int) error {
	return u.repo.Delete(id)
}

func (u *movieUsecase) SearchMovies(title string, genreID, limit, page int) ([]models.Media, int, error) {
	offset := (page - 1) * limit
	return u.repo.Search(title, genreID, limit, offset)
}