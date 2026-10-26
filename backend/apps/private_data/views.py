from django.shortcuts import get_object_or_404
from rest_framework import status, viewsets
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response

from apps.experiences.models import Experience
from apps.experiences.serializers import ExperienceSerializer
from apps.private_data.models import PrivateProfile
from apps.private_data.serializers import (
    AdminExperienceSerializer,
    AdminSkillSerializer,
    PrivateProfileSerializer,
)
from apps.skills.models import Skill
from apps.skills.serializers import SkillSerializer


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


class AdminExperienceViewSet(viewsets.GenericViewSet):
    permission_classes = [IsAdminUser]
    serializer_class = ExperienceSerializer

    def get_queryset(self):
        return Experience.objects.select_related("employment", "employment__employer", "employment__client").prefetch_related("translations", "urls", "phases", "experience_skills__skill__translations")

    def list(self, request, *args, **kwargs):
        serializer = ExperienceSerializer(self.get_queryset(), many=True, context={"request": request, "lang": "en"})
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = AdminExperienceSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        experience = serializer.save()
        response = experience.__class__.objects.filter(pk=experience.pk).select_related("employment", "employment__employer", "employment__client").prefetch_related("translations", "urls", "phases", "experience_skills__skill__translations").first()
        from apps.experiences.serializers import ExperienceSerializer
        return Response(ExperienceSerializer(response, context={"request": request, "lang": "en"}).data, status=status.HTTP_201_CREATED)

    def retrieve(self, request, *args, **kwargs):
        experience = get_object_or_404(self.get_queryset(), pk=kwargs.get("pk"))
        from apps.experiences.serializers import ExperienceSerializer
        return Response(ExperienceSerializer(experience, context={"request": request, "lang": "en"}).data)

    def update(self, request, *args, **kwargs):
        experience = get_object_or_404(self.get_queryset(), pk=kwargs.get("pk"))
        serializer = AdminExperienceSerializer(instance=experience, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        updated = serializer.save()
        from apps.experiences.serializers import ExperienceSerializer
        return Response(ExperienceSerializer(updated, context={"request": request, "lang": "en"}).data)

    def destroy(self, request, *args, **kwargs):
        experience = get_object_or_404(self.get_queryset(), pk=kwargs.get("pk"))
        experience.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class AdminSkillViewSet(viewsets.GenericViewSet):
    permission_classes = [IsAdminUser]
    serializer_class = SkillSerializer

    def get_queryset(self):
        return Skill.objects.prefetch_related("translations", "source_claims")

    def list(self, request, *args, **kwargs):
        serializer = SkillSerializer(self.get_queryset(), many=True, context={"request": request, "lang": "en"})
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = AdminSkillSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        skill = serializer.save()
        from apps.skills.serializers import SkillSerializer
        return Response(SkillSerializer(skill, context={"request": request, "lang": "en"}).data, status=status.HTTP_201_CREATED)

    def retrieve(self, request, *args, **kwargs):
        skill = get_object_or_404(self.get_queryset(), pk=kwargs.get("pk"))
        from apps.skills.serializers import SkillSerializer
        return Response(SkillSerializer(skill, context={"request": request, "lang": "en"}).data)

    def update(self, request, *args, **kwargs):
        skill = get_object_or_404(self.get_queryset(), pk=kwargs.get("pk"))
        serializer = AdminSkillSerializer(instance=skill, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        updated = serializer.save()
        from apps.skills.serializers import SkillSerializer
        return Response(SkillSerializer(updated, context={"request": request, "lang": "en"}).data)

    def destroy(self, request, *args, **kwargs):
        skill = get_object_or_404(self.get_queryset(), pk=kwargs.get("pk"))
        skill.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
