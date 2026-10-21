from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
)


def api_root(request):
    return JsonResponse({
        "name": "Developer Portfolio API",
        "version": "v1",
        "openapi": "/api/v1/openapi/",
        "docs": "/api/v1/docs/",
    })


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/", api_root, name="api-root"),
    path("api/v1/openapi/", SpectacularAPIView.as_view(), name="openapi-schema"),
    path("api/v1/docs/", SpectacularSwaggerView.as_view(url_name="openapi-schema"), name="swagger-ui"),
    # Copilot: add public API routes and admin-only routes here.
]
