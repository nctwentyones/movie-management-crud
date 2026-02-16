package usecase

import (
	"errors"
	"movie_crud/internal/models"
	"movie_crud/internal/repository"
)

type MovieUsecase interface {
	AddMovie(movie *models.Media) error
	FetchAllMovies() ([]models.Media, error)
	EditMovie(id int, movie *models.Media) error
	RemoveMovie(id int) error
	SearchMovies(title string) ([]models.Media, error)
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

func (u *movieUsecase) FetchAllMovies() ([]models.Media, error) {
	return u.repo.GetAll()
}

func (u *movieUsecase) EditMovie(id int, m *models.Media) error {
	return u.repo.Update(id, m)
}

func (u *movieUsecase) RemoveMovie(id int) error {
	return u.repo.Delete(id)
}

func (u *movieUsecase) SearchMovies(title string) ([]models.Media, error) {
	return u.repo.SearchByTitle(title)
}