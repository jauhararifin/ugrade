package main

import (
	"log"
	"net"

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

	lis, err := net.Listen("tcp", ":8888")
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	grpcServer.Serve(lis)
}
