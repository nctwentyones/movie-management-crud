FROM golang:1.23-alpine

RUN apk add --no-cache git
RUN go install github.com/air-verse/air@v1.61.7

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

# Build tetap dilakukan untuk memastikan dependensi oke
RUN go build -o main ./cmd/main.go

EXPOSE 8081

# Jalankan Air dari root direktori kerja /app
CMD ["air", "-c", ".air.toml"]