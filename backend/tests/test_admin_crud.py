import json

import pytest
from django.contrib.auth import get_user_model
from django.test import Client

from apps.skills.models import Skill


@pytest.mark.django_db
def test_staff_user_can_create_and_list_experiences_via_admin_api():
    User = get_user_model()
    user = User.objects.create_user(
        username="admin",
        email="admin@example.com",
        password="secure-pass-123",
        is_staff=True,
        is_superuser=True,
    )

    client = Client()
    client.force_login(user)

    payload = {
        "slug": "platform-engineer",
        "role": "Platform Engineer",
        "title": "Platform Engineer",
        "overview": "Built resilient platform tooling.",
        "responsibilities": "Improved release pipelines.",
        "contributions": "Reduced deployment time.",
        "start_date": "2024-01-01",
        "end_date": "2024-12-31",
        "employer": "Example Org",
        "client": "Client Org",
        "is_published": True,
        "order": 1,
        "urls": [
            {
                "url_type": "repository",
                "label": "Source",
                "url": "https://example.com/repo",
                "order": 1,
            }
        ],
    }

    response = client.post(
        "/api/v1/admin/experiences/",
        data=json.dumps(payload),
        content_type="application/json",
    )

    assert response.status_code == 201
    body = response.json()
    assert body["slug"] == "platform-engineer"
    assert body["role"] == "Platform Engineer"

    list_response = client.get("/api/v1/admin/experiences/")
    assert list_response.status_code == 200
    items = list_response.json()
    assert any(item["slug"] == "platform-engineer" for item in items)


@pytest.mark.django_db
def test_staff_user_can_update_and_delete_skill_via_admin_api():
    User = get_user_model()
    user = User.objects.create_user(
        username="skill-admin",
        email="skill-admin@example.com",
        password="secure-pass-123",
        is_staff=True,
        is_superuser=True,
    )

    skill = Skill.objects.create(
        name="TypeScript",
        slug="typescript",
        category="language",
        duration_months=36,
        is_featured=True,
        order=1,
    )

    client = Client()
    client.force_login(user)

    patch_response = client.patch(
        f"/api/v1/admin/skills/{skill.pk}/",
        data=json.dumps({
            "name": "TypeScript",
            "display_name": "TypeScript",
            "description": "Typed JavaScript for reliable systems.",
            "category": "language",
            "is_featured": True,
            "order": 2,
        }),
        content_type="application/json",
    )

    assert patch_response.status_code == 200
    assert patch_response.json()["display_name"] == "TypeScript"

    delete_response = client.delete(f"/api/v1/admin/skills/{skill.pk}/")
    assert delete_response.status_code == 204
    assert not Skill.objects.filter(pk=skill.pk).exists()
