from django.urls import path

from apps.skills.views import SkillViewSet

urlpatterns = [
    path("", SkillViewSet.as_view({"get": "list"}), name="skill-list"),
]
