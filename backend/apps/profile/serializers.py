from rest_framework import serializers

from apps.common.translation import get_requested_language, get_translation_for
from apps.profile.models import Profile, ProfileLink, ProfileSpokenLanguage, ProfileTranslation, SpokenLanguage


class ProfileLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfileLink
        fields = ["link_type", "label", "url", "order"]


class ProfileSpokenLanguageSerializer(serializers.ModelSerializer):
    language_name = serializers.SerializerMethodField()

    class Meta:
        model = ProfileSpokenLanguage
        fields = ["language_name", "proficiency_level", "order"]

    def get_language_name(self, obj):
        language = obj.spoken_language
        lang = self.context.get("lang", "en")
        translation = language.translations.filter(language_code=lang).first() or language.translations.filter(language_code="en").first()
        return translation.label if translation else language.canonical_name


class ProfileSerializer(serializers.ModelSerializer):
    display_name = serializers.SerializerMethodField()
    headline = serializers.SerializerMethodField()
    summary = serializers.SerializerMethodField()
    links = ProfileLinkSerializer(many=True, read_only=True)
    spoken_languages = ProfileSpokenLanguageSerializer(many=True, read_only=True)
    content_language = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = ["id", "profile_picture_url", "is_active", "display_name", "headline", "summary", "links", "spoken_languages", "content_language"]

    def _lang(self):
        return get_requested_language(self.context.get("request"), self.context.get("lang"), "en")

    def _translation(self, obj):
        return get_translation_for(obj, self._lang())

    def get_display_name(self, obj):
        translation = self._translation(obj)
        return translation.display_name if translation else None

    def get_headline(self, obj):
        translation = self._translation(obj)
        return translation.headline if translation else ""

    def get_summary(self, obj):
        translation = self._translation(obj)
        return translation.summary if translation else ""

    def get_content_language(self, obj):
        translation = self._translation(obj)
        return translation.language_code if translation else "en"


class ProfileTranslationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfileTranslation
        fields = ["language_code", "display_name", "headline", "summary"]
