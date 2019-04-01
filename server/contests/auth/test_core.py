import pytest
import jwt
import bcrypt
from mixer.backend.django import mixer
from django.test import TestCase

from contests.exceptions import NoSuchUserError, \
    NoSuchContestError, \
    AuthenticationError, \
    UserHaventSignedUpError
from .core import get_all_permissions, \
    get_all_users, \
    get_user_by_id, \
    get_user_by_username, \
    get_user_by_email, \
    get_contest_users, \
    sign_in


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
            sign_in('3', 'someemail', 'somepass')
        with pytest.raises(NoSuchContestError):
            sign_in('0', 'user1@example.com', 'pass')
        with pytest.raises(NoSuchContestError):
            sign_in('1.0', 'user1@example.com', 'pass')

    def test_wrong_email(self):
        with pytest.raises(AuthenticationError):
            sign_in('1', 'nonexistent@example.com', 'pass')

    def test_havent_signed_up(self):
        with pytest.raises(UserHaventSignedUpError):
            sign_in('1', 'user6@example.com', 'pass')

    def test_wrong_password(self):
        with pytest.raises(AuthenticationError):
            sign_in('1', 'user1@example.com', 'wrongpass')

    def test_success(self):
        user, token = sign_in('1', 'user2@example.com', 'testtest')
        assert user.id == 2
        assert token is not None and token != ''
        token_data = jwt.decode(token, verify=False)
        assert token_data['id'] == 2
