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

func (s *authServer) GetUserByID(_ context.Context, req *GetUserByIDRequest) (*GetUserByIDResponse, error) {
	user, err := s.service.UserByID(req.GetUserID())
	e, err := convertError(err)
	return &GetUserByIDResponse{
		User:  convertUser(user),
		Error: e,
	}, err
}

func (s *authServer) GetUserByEmail(context.Context, *GetUserByEmailRequest) (*GetUserByEmailResponse, error) {

}

func (s *authServer) GetUserByUsernames(context.Context, *GetUserByUsernamesRequest) (*GetUserByUsernamesResponse, error) {

}

func (s *authServer) SignIn(context.Context, *SignInRequest) (*SignInResponse, error) {

}

func (s *authServer) SignUp(context.Context, *SignUpRequest) (*SignUpResponse, error) {

}

func (s *authServer) ForgotPassword(context.Context, *ForgotPasswordRequest) (*Void, error) {

}

func (s *authServer) ResetPassword(context.Context, *ResetPasswordRequest) (*Void, error) {

}

func (s *authServer) GetMe(context.Context, *GetMeRequest) (*GetMeResponse, error) {

}

func (s *authServer) SetMyPassword(context.Context, *SetMyPasswordRequest) (*Void, error) {

}

func (s *authServer) SetMyName(context.Context, *SetMyNameRequest) (*Void, error) {

}
