package main

import (
	"log"
	"net/http"

	"github.com/jauhararifin/ugrade/server/auth/simple"
	"github.com/jauhararifin/ugrade/server/auth/simple/inmemory"
	"github.com/jauhararifin/ugrade/server/server"
	"google.golang.org/grpc"
)

func main() {
	authStore := inmemory.New()
	authService := simple.New(authStore)
	authServer := server.NewAuthServer(authService)

	grpcServer := grpc.NewServer()
	server.RegisterAuthServiceServer(grpcServer, authServer)

	http.HandleFunc("/grpc", func(w http.ResponseWriter, r *http.Request) {
		grpcServer.ServeHTTP(w, r)
	})
	err := http.ListenAndServe(":8888", nil)
	if err != nil {
		log.Fatal(err)
	}
}
