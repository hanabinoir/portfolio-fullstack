from rest_framework import serializers

from apps.common.translation import get_requested_language, get_translation_for
from apps.experiences.models import Employment, Experience, ExperiencePhase, ExperienceSkill, ExperienceTranslation, ExperienceURL


class ExperiencePhaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExperiencePhase
        fields = ["phase_name", "phase_order"]


class ExperienceURLSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExperienceURL
        fields = ["url_type", "label", "url", "order"]


class ExperienceSkillSerializer(serializers.ModelSerializer):
    skill_name = serializers.SerializerMethodField()

    class Meta:
        model = ExperienceSkill
        fields = ["skill_name", "order"]

    def get_skill_name(self, obj):
        lang = self.context.get("lang", "en")
        translation = obj.skill.translations.filter(language_code=lang).first() or obj.skill.translations.filter(language_code="en").first()
        return translation.display_name if translation else obj.skill.name


class ExperienceSerializer(serializers.ModelSerializer):
    title = serializers.SerializerMethodField()
    overview = serializers.SerializerMethodField()
    responsibilities = serializers.SerializerMethodField()
    contributions = serializers.SerializerMethodField()
    urls = ExperienceURLSerializer(many=True, read_only=True)
    phases = ExperiencePhaseSerializer(many=True, read_only=True)
    skills = ExperienceSkillSerializer(many=True, read_only=True, source="experience_skills")
    employer = serializers.SerializerMethodField()
    client = serializers.SerializerMethodField()
    content_language = serializers.SerializerMethodField()

    class Meta:
        model = Experience
        fields = [
            "id",
            "slug",
            "role",
            "title",
            "overview",
            "responsibilities",
            "contributions",
            "start_date",
            "end_date",
            "team_size",
            "is_published",
            "order",
            "employer",
            "client",
            "urls",
            "phases",
            "skills",
            "content_language",
        ]

    def _lang(self):
        return get_requested_language(self.context.get("request"), self.context.get("lang"), "en")

    def _translation(self, obj):
        return get_translation_for(obj, self._lang())

    def get_title(self, obj):
        translation = self._translation(obj)
        return translation.title if translation else obj.role

    def get_overview(self, obj):
        translation = self._translation(obj)
        return translation.overview if translation else ""

    def get_responsibilities(self, obj):
        translation = self._translation(obj)
        return translation.responsibilities if translation else ""

    def get_contributions(self, obj):
        translation = self._translation(obj)
        return translation.contributions if translation else None

    def get_employer(self, obj):
        lang = self._lang()
        name = obj.employment.employer.name
        translation = obj.employment.employer.translations.filter(language_code=lang).first() or obj.employment.employer.translations.filter(language_code="en").first()
        return translation.display_name if translation else name

    def get_client(self, obj):
        if not obj.employment.client:
            return None
        lang = self._lang()
        name = obj.employment.client.name
        translation = obj.employment.client.translations.filter(language_code=lang).first() or obj.employment.client.translations.filter(language_code="en").first()
        return translation.display_name if translation else name

    def get_content_language(self, obj):
        translation = self._translation(obj)
        return translation.language_code if translation else "en"


class EmploymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employment
        fields = ["id", "employer", "client", "start_date", "end_date", "employment_type", "order"]


class ExperienceTranslationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExperienceTranslation
        fields = ["language_code", "title", "overview", "responsibilities", "contributions"]
