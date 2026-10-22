from rest_framework import viewsets
from rest_framework.permissions import AllowAny

from apps.experiences.models import Experience
from apps.experiences.serializers import ExperienceSerializer


class ExperienceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Experience.objects.filter(is_published=True).select_related("employment", "employment__employer", "employment__client").prefetch_related("translations", "urls", "phases", "experience_skills__skill__translations")
    serializer_class = ExperienceSerializer
    permission_classes = [AllowAny]
    lookup_field = "slug"

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["lang"] = self.request.query_params.get("lang", "en")
        return context
