from rest_framework import viewsets
from rest_framework.permissions import AllowAny

from apps.organizations.models import Organization
from apps.organizations.serializers import OrganizationSerializer


class OrganizationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Organization.objects.prefetch_related("translations")
    serializer_class = OrganizationSerializer
    permission_classes = [AllowAny]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["lang"] = self.request.query_params.get("lang", "en")
        return context
