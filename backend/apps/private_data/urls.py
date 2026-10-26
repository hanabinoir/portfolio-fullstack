from django.urls import path

from apps.private_data.views import AdminExperienceViewSet, AdminSkillViewSet, PrivateProfileViewSet

urlpatterns = [
    path("private-profile/", PrivateProfileViewSet.as_view({"get": "list", "patch": "update"}), name="private-profile"),
    path("experiences/", AdminExperienceViewSet.as_view({"get": "list", "post": "create"}), name="admin-experience-list"),
    path("experiences/<uuid:pk>/", AdminExperienceViewSet.as_view({"get": "retrieve", "patch": "update", "delete": "destroy"}), name="admin-experience-detail"),
    path("skills/", AdminSkillViewSet.as_view({"get": "list", "post": "create"}), name="admin-skill-list"),
    path("skills/<uuid:pk>/", AdminSkillViewSet.as_view({"get": "retrieve", "patch": "update", "delete": "destroy"}), name="admin-skill-detail"),
]
