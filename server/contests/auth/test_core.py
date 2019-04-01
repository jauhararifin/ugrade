import pytest
from mixer.backend.django import mixer
from contests.exceptions import NoSuchUserError, NoSuchContestError
from .core import get_all_permissions, \
    get_all_users, \
    get_user_by_id, \
    get_user_by_username, \
    get_user_by_email, \
    get_contest_users


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
