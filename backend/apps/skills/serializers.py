from rest_framework import serializers

from apps.common.translation import get_requested_language, get_translation_for
from apps.skills.models import Skill, SkillSourceClaim, SkillTranslation


class SkillSerializer(serializers.ModelSerializer):
    display_name = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    content_language = serializers.SerializerMethodField()

    class Meta:
        model = Skill
        fields = ["id", "name", "slug", "category", "display_name", "description", "duration_months", "is_featured", "order", "content_language"]

    def _lang(self):
        return get_requested_language(self.context.get("request"), self.context.get("lang"), "en")

    def _translation(self, obj):
        return get_translation_for(obj, self._lang())

    def get_display_name(self, obj):
        translation = self._translation(obj)
        return translation.display_name if translation else obj.name

    def get_description(self, obj):
        translation = self._translation(obj)
        return translation.description if translation else ""

    def get_content_language(self, obj):
        translation = self._translation(obj)
        return translation.language_code if translation else "en"


class SkillTranslationSerializer(serializers.ModelSerializer):
    class Meta:
        model = SkillTranslation
        fields = ["language_code", "display_name", "description"]


class SkillSourceClaimSerializer(serializers.ModelSerializer):
    class Meta:
        model = SkillSourceClaim
        fields = ["id", "source_language", "source_document", "original_name", "original_duration_text", "notes", "review_status"]
