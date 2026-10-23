import pytest
from django.contrib.auth import get_user_model
from django.test import Client


@pytest.mark.django_db
def test_session_endpoint_reports_anonymous_user():
    response = Client().get("/api/v1/auth/session/")

    assert response.status_code == 200
    assert response.json() == {"authenticated": False, "user": None}


@pytest.mark.django_db
def test_staff_user_can_log_in_and_create_session():
    User = get_user_model()
    user = User.objects.create_user(
        username="admin",
        password="secure-pass-123",
        is_staff=True,
        is_superuser=True,
    )

    client = Client()
    response = client.post(
        "/api/v1/auth/login/",
        {"username": user.username, "password": "secure-pass-123"},
    )

    assert response.status_code == 200
    assert response.json()["authenticated"] is True
    assert response.json()["user"]["username"] == "admin"
    assert "_auth_user_id" in client.session


@pytest.mark.django_db
def test_non_admin_user_is_rejected_from_login():
    User = get_user_model()
    User.objects.create_user(username="guest", password="secure-pass-123")

    response = Client().post(
        "/api/v1/auth/login/",
        {"username": "guest", "password": "secure-pass-123"},
    )

    assert response.status_code == 403
    assert "Admin access is required." in response.json()["detail"]
