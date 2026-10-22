from rest_framework import status, viewsets
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response

from apps.private_data.models import PrivateProfile
from apps.private_data.serializers import PrivateProfileSerializer


class PrivateProfileViewSet(viewsets.GenericViewSet):
    serializer_class = PrivateProfileSerializer
    permission_classes = [IsAdminUser]

    def get_object(self):
        return PrivateProfile.objects.first()

    def list(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance is None:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance is None:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
