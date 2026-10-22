from django.urls import path

from apps.experiences.views import ExperienceViewSet

urlpatterns = [
    path("", ExperienceViewSet.as_view({"get": "list"}), name="experience-list"),
    path("<slug:slug>/", ExperienceViewSet.as_view({"get": "retrieve"}), name="experience-detail"),
]
