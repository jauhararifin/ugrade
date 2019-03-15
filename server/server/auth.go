package server

import (
	context "context"

	"github.com/jauhararifin/ugrade/server/auth"
	"github.com/pkg/errors"
)

//go:generate protoc -I . auth.proto --go_out=plugins=grpc:.

type authServer struct {
	service auth.Service
}

// NewAuthServer create a new AuthServiceServer implementation
func NewAuthServer(authService auth.Service) AuthServiceServer {
	return &authServer{
		service: authService,
	}
}

func convertPermission(p int) Permission {
	switch p {
	case auth.PermissionInfoUpdate:
		return Permission_InfoUpdate
	case auth.PermissionAnnouncementsCreate:
		return Permission_AnnouncementsCreate
	case auth.PermissionAnnouncementsRead:
		return Permission_AnnouncementsRead
	case auth.PermissionProblemsCreate:
		return Permission_ProblemsCreate
	case auth.PermissionProblemsRead:
		return Permission_ProblemsRead
	case auth.PermissionProblemsReadDisabled:
		return Permission_ProblemsReadDisabled
	case auth.PermissionProblemsUpdate:
		return Permission_ProblemsUpdate
	case auth.PermissionUsersInvite:
		return Permission_UsersInvite
	case auth.PermissionUsersPermissionsUpdate:
		return Permission_UsersPermissionsUpdate
	case auth.PermissionUsersDelete:
		return Permission_UsersDelete
	}
	panic("permission not found")
}

func convertUser(p *auth.User) *User {
	permissions := make([]Permission, 0, len(p.Permissions))
	for _, perm := range p.Permissions {
		permissions = append(permissions, convertPermission(perm))
	}
	return &User{
		ID:          p.ID,
		ContestID:   p.ContestID,
		Name:        p.Name,
		Username:    p.Username,
		Permissions: permissions,
		Email:       p.Email,
	}
}

func convertError(e error) (*AuthError, error) {
	if e == nil {
		return nil, nil
	}

	invalidInput := AuthError_InvalidInput{
		InvalidInput: false,
	}
	if ok, invInp := auth.IsInvalidInput(e); ok {
		invalidInput.InvalidInput = true
		invalidInput.Username = invInp.Username()
		invalidInput.Name = invInp.Name()
		invalidInput.Email = invInp.Email()
		invalidInput.Password = invInp.Password()
		invalidInput.Permissions = invInp.Permissions()
	}

	return &AuthError{
		Msg:                  e.Error(),
		NoSuchUser:           auth.IsNoSuchUser(e),
		NoSuchContest:        auth.IsNoSuchContest(e),
		WrongCredential:      auth.IsWrongCredential(e),
		WrongToken:           auth.IsWrongToken(e),
		InvalidSession:       auth.IsInvalidSession(e),
		ForbiddenAction:      auth.IsForbiddenAction(e),
		InvalidInput:         &invalidInput,
		UsernameAlreadyUsed:  auth.IsUsernameAlreadyUsed(e),
		AlreadyInvited:       auth.IsAlreadyInvited(e),
		AlreadySignedUp:      auth.IsAlreadySignedUp(e),
		ContestAlreadyExists: auth.IsContestAlreadyExists(e),
	}, errors.Wrap(e, "grpc error")
}

func (s *authServer) GetUserByID(ctx context.Context, req *GetUserByIDRequest) (*GetUserByIDResponse, error) {
	user, err := s.service.UserByID(ctx, req.GetUserID())
	e, err := convertError(err)
	return &GetUserByIDResponse{
		User:  convertUser(user),
		Error: e,
	}, err
}

func (s *authServer) GetUserByEmail(ctx context.Context, req *GetUserByEmailRequest) (*GetUserByEmailResponse, error) {
	user, err := s.service.UserByEmail(ctx, req.GetContestID(), req.GetEmail())
	e, err := convertError(err)
	return &GetUserByEmailResponse{
		User:  convertUser(user),
		Error: e,
	}, err
}

func (s *authServer) GetUserByUsernames(ctx context.Context, req *GetUserByUsernamesRequest) (*GetUserByUsernamesResponse, error) {
	users, err := s.service.UserByUsernames(ctx, req.GetContestID(), req.GetUsernames())
	e, err := convertError(err)
	result := make([]*User, 0, len(users))
	for _, u := range users {
		result = append(result, convertUser(u))
	}
	return &GetUserByUsernamesResponse{
		User:  result,
		Error: e,
	}, err
}

func (s *authServer) SignIn(ctx context.Context, req *SignInRequest) (*SignInResponse, error) {
	token, err := s.service.SignIn(ctx, req.GetContestID(), req.GetEmail(), req.GetPassword())
	e, err := convertError(err)
	return &SignInResponse{
		Token: token,
		Error: e,
	}, err
}

func (s *authServer) SignUp(ctx context.Context, req *SignUpRequest) (*SignUpResponse, error) {
	token, err := s.service.SignUp(ctx, req.GetContestID(), req.GetUsername(), req.GetEmail(), req.GetOneTimeCode(), req.GetPassword(), req.GetName())
	e, err := convertError(err)
	return &SignUpResponse{
		Token: token,
		Error: e,
	}, err
}

func (s *authServer) ForgotPassword(ctx context.Context, req *ForgotPasswordRequest) (*ForgotPasswordResponse, error) {
	err := s.service.ForgotPassword(ctx, req.GetContestID(), req.GetEmail())
	e, err := convertError(err)
	return &ForgotPasswordResponse{
		Error: e,
	}, err
}

func (s *authServer) ResetPassword(ctx context.Context, req *ResetPasswordRequest) (*ResetPasswordResponse, error) {
	err := s.service.ResetPassword(ctx, req.GetContestID(), req.GetEmail(), req.GetOneTimeCode(), req.GetPassword())
	e, err := convertError(err)
	return &ResetPasswordResponse{
		Error: e,
	}, err
}

func (s *authServer) GetMe(ctx context.Context, req *GetMeRequest) (*GetMeResponse, error) {
	user, err := s.service.Me(ctx, req.GetToken())
	e, err := convertError(err)
	return &GetMeResponse{
		Me:    convertUser(user),
		Error: e,
	}, err
}

func (s *authServer) SetMyPassword(ctx context.Context, req *SetMyPasswordRequest) (*SetMyPasswordResponse, error) {
	err := s.service.SetMyPassword(ctx, req.GetToken(), req.GetOldPassword(), req.GetNewPassword())
	e, err := convertError(err)
	return &SetMyPasswordResponse{
		Error: e,
	}, err
}

func (s *authServer) SetMyName(ctx context.Context, req *SetMyNameRequest) (*SetMyNameResponse, error) {
	err := s.service.SetMyName(ctx, req.GetToken(), req.GetName())
	e, err := convertError(err)
	return &SetMyNameResponse{
		Error: e,
	}, err
}
