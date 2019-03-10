package auth

import (
	context "context"
	fmt "fmt"

	"golang.org/x/crypto/bcrypt"
	"google.golang.org/grpc/status"
)

// NoSuchUserErrorCode indicate the user is not exists in specific contest.
// This can happen when calling GetUserByEmail and the user is not exists.
const NoSuchUserErrorCode = 1

// AuthenticationErrorCode indicate that you are trying to authenticate yourself but failed.
// May because wrong password or something else.
const AuthenticationErrorCode = 2

// UserNotRegisteredYetErrorCode indicate that you are trying to access some resource but haven't registered yet.
const UserNotRegisteredYetErrorCode = 3

// DefaultService implements AuthServiceServer
type DefaultService struct {
	userEmailMap        map[string]User
	userUsernameMap     map[string]User
	userPasswordMap     map[string]string
	userTokenMap        map[string]User
	userTokenReverseMap map[string]string
}

// NewDefault create default implementation of AuthServiceServer
func NewDefault() *DefaultService {
	return &DefaultService{
		userEmailMap:        make(map[string]User),
		userUsernameMap:     make(map[string]User),
		userPasswordMap:     make(map[string]string),
		userTokenMap:        make(map[string]User),
		userTokenReverseMap: make(map[string]string),
	}
}

// GetUserByEmail returns specific user by its email
func (m *DefaultService) GetUserByEmail(ctx context.Context, req *GetUserByEmailRequest) (*GetUserByEmailResponse, error) {
	contestID, email := req.GetContestId(), req.GetEmail()
	key := fmt.Sprintf("%s/%s", contestID, email)
	if user, ok := m.userEmailMap[key]; ok {
		return &GetUserByEmailResponse{
			User: &user,
		}, nil
	}
	return nil, status.Error(NoSuchUserErrorCode, "No Such User")
}

// GetUserByUsernames returns list of user that have specific usernames.
func (m *DefaultService) GetUserByUsernames(_ context.Context, req *GetUserByUsernamesRequest) (*GetUserByUsernamesResponse, error) {
	contestID, usernames := req.GetContestId(), req.GetUsernames()
	result := make([]*User, 0, len(usernames))
	for _, username := range usernames {
		key := fmt.Sprintf("%s/%s", contestID, username)
		if user, ok := m.userUsernameMap[key]; ok {
			result = append(result, &user)
		}
	}
	return &GetUserByUsernamesResponse{
		User: result,
	}, nil
}

// SignIn will match user email and password. When matched, will return session token for the user's
func (m *DefaultService) SignIn(_ context.Context, req *SignInRequest) (*SignInResponse, error) {
	contestID, email, password := req.GetContestId(), req.GetEmail(), req.GetPassword()
	key := fmt.Sprintf("%s/%s", contestID, email)
	if user, ok := m.userEmailMap[key]; ok {
		if actualPassword, ok := m.userPasswordMap[key]; ok {
			bytePassword := []byte(password)
			byteActualPassword := []byte(actualPassword)
			if err := bcrypt.CompareHashAndPassword(bytePassword, byteActualPassword); err != nil {
				token := ""
				if token, ok = m.userTokenReverseMap[user.Id]; !ok {
					token = generateRandomToken()
				}
				m.userTokenMap[token] = user
				m.userTokenReverseMap[user.Id] = token
				return &SignInResponse{
					Token: token,
				}, nil
			}
			return nil, status.Error(AuthenticationErrorCode, "Wrong Username Or Password")
		}
		return nil, status.Error(UserNotRegisteredYetErrorCode, "User Not Yet Registered")
	}
	return nil, status.Error(AuthenticationErrorCode, "Wrong Username Or Password")
}
