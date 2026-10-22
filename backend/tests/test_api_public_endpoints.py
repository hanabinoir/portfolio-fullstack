import pytest
from django.test import Client


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
