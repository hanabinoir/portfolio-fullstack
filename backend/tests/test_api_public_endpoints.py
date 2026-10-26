import pytest
from django.contrib.auth import get_user_model
from django.test import Client

from apps.private_data.models import PrivateProfile
from apps.profile.models import Profile


@pytest.mark.django_db
def test_profile_endpoint_returns_empty_list_when_no_data():
    response = Client().get("/api/v1/profile/")
    assert response.status_code == 200
    assert response.json() == []


@pytest.mark.django_db
def test_organizations_endpoint_returns_empty_list_when_no_data():
    response = Client().get("/api/v1/organizations/")
    assert response.status_code == 200
    assert response.json() == []


@pytest.mark.django_db
def test_skills_endpoint_returns_empty_list_when_no_data():
    response = Client().get("/api/v1/skills/")
    assert response.status_code == 200
    assert response.json() == []


@pytest.mark.django_db
def test_experiences_endpoint_returns_empty_list_when_no_data():
    response = Client().get("/api/v1/experiences/")
    assert response.status_code == 200
    assert response.json() == []


@pytest.mark.django_db
def test_private_profile_endpoint_requires_admin_access():
    response = Client().get("/api/v1/admin/private-profile/")
    assert response.status_code == 403


@pytest.mark.django_db
def test_admin_user_can_access_private_profile_when_record_exists():
    profile = Profile.objects.create()
    PrivateProfile.objects.create(profile=profile, address="123 Market St")

    User = get_user_model()
    user = User.objects.create_user(username="admin", password="secret", is_staff=True, is_superuser=True)

    client = Client()
    client.force_login(user)

    response = client.get("/api/v1/admin/private-profile/")

    assert response.status_code == 200
    assert response.json()["address"] == "123 Market St"
