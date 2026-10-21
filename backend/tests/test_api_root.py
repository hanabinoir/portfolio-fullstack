from django.test import Client


def test_api_root_lists_schema_and_docs_urls():
    response = Client().get("/api/v1/")
    assert response.status_code == 200
    assert response.json()["openapi"] == "/api/v1/openapi/"
    assert response.json()["docs"] == "/api/v1/docs/"
