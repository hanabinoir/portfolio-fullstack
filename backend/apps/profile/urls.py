from django.urls import path

from apps.profile.views import ProfileViewSet

urlpatterns = [
    path("", ProfileViewSet.as_view({"get": "list"}), name="profile-list"),
]
