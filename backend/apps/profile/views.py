from rest_framework import viewsets
from rest_framework.permissions import AllowAny

from apps.profile.models import Profile
from apps.profile.serializers import ProfileSerializer


class ProfileViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Profile.objects.filter(is_active=True).prefetch_related("translations", "links", "spoken_languages__spoken_language__translations")
    serializer_class = ProfileSerializer
    permission_classes = [AllowAny]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["lang"] = self.request.query_params.get("lang", "en")
        return context
