from rest_framework import serializers

from apps.common.translation import get_requested_language, get_translation_for
from apps.organizations.models import Organization, OrganizationTranslation


class OrganizationSerializer(serializers.ModelSerializer):
    display_name = serializers.SerializerMethodField()
    website_url = serializers.URLField(read_only=True)
    content_language = serializers.SerializerMethodField()

    class Meta:
        model = Organization
        fields = ["id", "display_name", "website_url", "content_language"]

    def _lang(self):
        return get_requested_language(self.context.get("request"), self.context.get("lang"), "en")

    def _translation(self, obj):
        return get_translation_for(obj, self._lang())

    def get_display_name(self, obj):
        translation = self._translation(obj)
        return translation.display_name if translation else obj.name

    def get_content_language(self, obj):
        translation = self._translation(obj)
        return translation.language_code if translation else "en"


class OrganizationTranslationSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrganizationTranslation
        fields = ["language_code", "display_name"]
