from django.urls import path

from apps.private_data.views import PrivateProfileViewSet

urlpatterns = [
    path("admin/private-profile/", PrivateProfileViewSet.as_view({"get": "list", "patch": "update"}), name="private-profile"),
]
