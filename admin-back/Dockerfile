ARG GO_VERSION=1.25.4

FROM golang:${GO_VERSION} AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o server ./main.go

FROM gcr.io/distroless/base-debian12 AS runtime

WORKDIR /app
COPY --from=builder /app/server /app/server

EXPOSE 8080

ENTRYPOINT ["/app/server"]
