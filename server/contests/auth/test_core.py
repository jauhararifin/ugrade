import pytest
import jwt
import bcrypt
from mixer.backend.django import mixer

from django.test import TestCase
from django.core.exceptions import ValidationError

from contests.models import User
from contests.exceptions import NoSuchUserError, \
    NoSuchContestError, \
    AuthenticationError, \
    UserHaventSignedUpError, \
    UserAlreadySignedUpError, \
    UsernameAlreadyUsedError
from .core import get_all_permissions, \
    get_all_users, \
    get_user_by_id, \
    get_user_by_username, \
    get_user_by_email, \
    get_contest_users, \
    sign_in, \
    sign_up, \
    forgot_password, \
    reset_password


@pytest.mark.django_db
def test_get_all_permissions():
    mixer.cycle(5).blend('contests.Permission')
    assert len(get_all_permissions()) == 5


@pytest.mark.django_db
def test_get_all_users():
    mixer.cycle(5).blend('contests.User')
    users = get_all_users()
    assert len(users) == 5


@pytest.mark.django_db
def test_get_user_by_id():
    perm1 = mixer.blend('contests.Permission', code='perm1')
    perm2 = mixer.blend('contests.Permission', code='perm2')
    mixer.cycle(5).blend('contests.User', name='Test Name',
                         permissions=[perm1, perm2])
    user1 = get_user_by_id(1)

    assert user1.name == 'Test Name'
    assert user1.has_permission('perm1') and user1.has_permission('perm2')
    assert user1.permission_codes == ['perm1', 'perm2']

    with pytest.raises(NoSuchUserError):
        get_user_by_id(6)


@pytest.mark.django_db
def test_get_user_by_username():
    contest1 = mixer.blend('contests.Contest', id=1, name='Contest 1')
    mixer.blend('contests.Contest', id=2, name='Contest 2')
    mixer.blend('contests.User', name='Test 1',
                username='username1', contest=contest1)
    mixer.blend('contests.User', name='Test 2',
                username='username2', contest=contest1)

    assert get_user_by_username(1, 'username1').name == 'Test 1'
    assert get_user_by_username(1, 'username2').name == 'Test 2'
    with pytest.raises(NoSuchUserError):
        get_user_by_username(1, 'nonexistent')
    with pytest.raises(NoSuchUserError):
        get_user_by_username(2, 'username2')
    with pytest.raises(NoSuchContestError):
        get_user_by_username(3, 'username1')


@pytest.mark.django_db
def test_get_user_by_email():
    contest1 = mixer.blend('contests.Contest', id=1, name='Contest 1')
    mixer.blend('contests.Contest', id=2, name='Contest 2')
    mixer.blend('contests.User', name='Test 1',
                email='email1', contest=contest1)
    mixer.blend('contests.User', name='Test 2',
                email='email2', contest=contest1)

    assert get_user_by_email(1, 'email1').name == 'Test 1'
    assert get_user_by_email(1, 'email2').name == 'Test 2'
    with pytest.raises(NoSuchUserError):
        get_user_by_email(1, 'nonexistent')
    with pytest.raises(NoSuchUserError):
        get_user_by_email(2, 'email2')
    with pytest.raises(NoSuchContestError):
        get_user_by_email(3, 'email1')


@pytest.mark.django_db
def test_get_contest_users():
    contest1 = mixer.blend('contests.Contest', id=1)
    mixer.cycle(5).blend('contests.User', name='Name', contest=contest1)

    result = get_contest_users(1)
    assert len(result) == 5
    for user in result:
        assert user.name == 'Name'

    with pytest.raises(NoSuchContestError):
        get_contest_users(2)


@pytest.mark.django_db
class SignInTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        contest1 = mixer.blend('contests.Contest', id=1)
        mixer.cycle(5).blend('contests.User',
                             name=("User %d" % n for n in range(1, 6)),
                             email=("user%d@example.com" %
                                    n for n in range(1, 6)),
                             username=("user%d" % n for n in range(1, 6)),
                             password=bcrypt.hashpw(
                                 b'testtest', bcrypt.gensalt()).decode('utf-8'),
                             contest=contest1)
        mixer.blend('contests.User', name='User 6',
                    contest=contest1, email='user6@example.com')

    def test_wrong_contest_id(self):
        with pytest.raises(NoSuchContestError):
            sign_in(3, 'someemail', 'somepass')
        with pytest.raises(NoSuchContestError):
            sign_in(0, 'user1@example.com', 'pass')

    def test_wrong_email(self):
        with pytest.raises(AuthenticationError):
            sign_in(1, 'nonexistent@example.com', 'pass')

    def test_havent_signed_up(self):
        with pytest.raises(UserHaventSignedUpError):
            sign_in(1, 'user6@example.com', 'pass')

    def test_wrong_password(self):
        with pytest.raises(AuthenticationError):
            sign_in(1, 'user1@example.com', 'wrongpass')

    def test_success(self):
        user, token = sign_in(1, 'user2@example.com', 'testtest')
        assert user.id == 2
        assert token is not None and token != ''
        token_data = jwt.decode(token, verify=False)
        assert token_data['id'] == 2


@pytest.mark.django_db
class SignUpTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        contest1 = mixer.blend('contests.Contest', id=1)
        contest2 = mixer.blend('contests.Contest', id=2)
        mixer.blend('contests.User',
                    name='Some Name',
                    email='email@example.com',
                    username='username',
                    password=bcrypt.hashpw(
                        b'userpass', bcrypt.gensalt()).decode('utf-8'),
                    contest=contest1)
        mixer.blend('contests.User',
                    email='email@example.com',
                    contest=contest2,
                    signup_otc='12345678')
        mixer.blend('contests.User',
                    name='Jauhar Arifin',
                    email='jauhararifin@example.com',
                    username='jauhararifin',
                    password=bcrypt.hashpw(
                        b'userpass', bcrypt.gensalt()).decode('utf-8'),
                    contest=contest2)

    def test_wrong_contest_id(self):
        with pytest.raises(NoSuchContestError):
            sign_up(3, 'someemail', 'username', 'name', 'somepass', '00000000')
        with pytest.raises(NoSuchContestError):
            sign_up(0, 'emailexample.com', 'username',
                    'name', 'somepass', '92847118')

    def test_wrong_email(self):
        with pytest.raises(NoSuchUserError):
            sign_up(1, 'someemail', 'username', 'name', 'somepass', '00000000')
        with pytest.raises(NoSuchUserError):
            sign_up(2, 'someemail', 'username', 'name', 'somepass', '92847118')

    def test_already_signed_up(self):
        with pytest.raises(UserAlreadySignedUpError):
            sign_up(1, 'email@example.com', 'username',
                    'name', 'somepass', '00000000')

    def test_wrong_otc(self):
        with pytest.raises(AuthenticationError):
            sign_up(2, 'email@example.com', 'username',
                    'name', 'somepass', '00000000')

    def test_already_used_username(self):
        with pytest.raises(UsernameAlreadyUsedError):
            sign_up(2, 'email@example.com', 'jauhararifin',
                    'name', 'somepass', '12345678')

    def test_invalid_input(self):
        with pytest.raises(ValidationError) as error:
            sign_up(2, 'email@example.com', 'u',
                    'name', 'password', '12345678')
        assert error.value.message_dict['username'] is not None

    def test_success(self):
        user, token = sign_up(2, 'email@example.com',
                              'username', 'My Name', 'mypassword', '12345678')

        assert user.id == 2
        assert token is not None and token != ''
        token_data = jwt.decode(token, verify=False)
        assert token_data['id'] == 2

        user = User.objects.get(pk=2)
        assert user.signup_otc is None


@pytest.mark.django_db
class ForgotPasswordTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        contest1 = mixer.blend('contests.Contest', id=1)
        mixer.blend('contests.User',
                    name='Some Name 1',
                    email='email1@example.com',
                    username='username1',
                    password=bcrypt.hashpw(
                        b'userpass1', bcrypt.gensalt()).decode('utf-8'),
                    contest=contest1)
        mixer.blend('contests.User',
                    email='email2@example.com',
                    contest=contest1,
                    signup_otc='12345678')

    def test_wrong_contest_id(self):
        with pytest.raises(NoSuchContestError):
            forgot_password(3, 'email1@example.com')
        with pytest.raises(NoSuchContestError):
            forgot_password(0, 'email2@example.com')

    def test_wrong_email(self):
        with pytest.raises(NoSuchUserError):
            forgot_password(1, 'nonexistent@example.com')

    def test_havent_signed_up(self):
        with pytest.raises(UserHaventSignedUpError):
            forgot_password(1, 'email2@example.com')

    def test_success_and_create_new_otc(self):
        forgot_password(1, 'email1@example.com')
        user = User.objects.get(pk=1)
        assert user.reset_password_otc is not None

    def test_success_and_use_old_otc(self):
        user = User.objects.get(pk=1)
        user.reset_password_otc = '00000000'
        user.save()

        forgot_password(1, 'email1@example.com')
        user = User.objects.get(pk=1)
        assert user.reset_password_otc == '00000000'


@pytest.mark.django_db
class ResetPasswordTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        contest1 = mixer.blend('contests.Contest', id=1)
        mixer.blend('contests.User',
                    name='Some Name 1',
                    email='email1@example.com',
                    username='username1',
                    password=bcrypt.hashpw(
                        b'userpass1', bcrypt.gensalt()).decode('utf-8'),
                    contest=contest1)
        mixer.blend('contests.User',
                    email='email2@example.com',
                    contest=contest1,
                    signup_otc='12345678')

    def test_wrong_contest_id(self):
        with pytest.raises(NoSuchContestError):
            reset_password(3, 'email1@example.com', '00000000', 'newpassword')
        with pytest.raises(NoSuchContestError):
            reset_password(0, 'email2@example.com', '00000000', 'newpassword')

    def test_wrong_email(self):
        with pytest.raises(NoSuchUserError):
            reset_password(1, 'nonexistent@example.com',
                           '00000000', 'newpassword')

    def test_havent_signed_up(self):
        with pytest.raises(UserHaventSignedUpError):
            reset_password(1, 'email2@example.com', '00000000', 'newpassword')

    def test_wrong_code(self):
        user = User.objects.get(pk=1)
        user.reset_password_otc = '12345678'
        user.save()
        with pytest.raises(AuthenticationError):
            reset_password(1, 'email1@example.com', '00000000', 'newpassword')

    def test_success(self):
        user = User.objects.get(pk=1)
        user.reset_password_otc = '00000000'
        user.save()

        reset_password(1, 'email1@example.com', '00000000', 'newpassword')
        user = User.objects.get(pk=1)
        assert bcrypt.checkpw(b'newpassword', bytes(user.password, 'utf-8'))

    def test_with_forgot_password(self):
        forgot_password(1, 'email1@example.com')
        user = User.objects.get(pk=1)
        assert user.reset_password_otc is not None

        reset_password(1, 'email1@example.com',
                       user.reset_password_otc, 'newpassword')
        user = User.objects.get(pk=1)
        assert bcrypt.checkpw(b'newpassword', bytes(user.password, 'utf-8'))
