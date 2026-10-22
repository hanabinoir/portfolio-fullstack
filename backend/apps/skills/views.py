from rest_framework import viewsets
from rest_framework.permissions import AllowAny

from apps.skills.models import Skill
from apps.skills.serializers import SkillSerializer


class SkillViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Skill.objects.prefetch_related("translations", "source_claims")
    serializer_class = SkillSerializer
    permission_classes = [AllowAny]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["lang"] = self.request.query_params.get("lang", "en")
        return context
