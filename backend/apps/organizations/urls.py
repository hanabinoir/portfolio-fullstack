from django.urls import path

from apps.organizations.views import OrganizationViewSet

urlpatterns = [
    path("", OrganizationViewSet.as_view({"get": "list"}), name="organization-list"),
]
