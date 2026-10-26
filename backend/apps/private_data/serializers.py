from rest_framework import serializers

from apps.experiences.models import Employment, Experience, ExperienceTranslation, ExperienceURL
from apps.organizations.models import Organization
from apps.private_data.models import PrivateProfile
from apps.skills.models import Skill, SkillTranslation


class PrivateProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrivateProfile
        fields = ["id", "profile", "address", "phone_number", "citizenship", "visa_type", "visa_expiry_date"]
        read_only_fields = ["id", "profile"]


class AdminExperienceSerializer(serializers.Serializer):
    slug = serializers.SlugField(required=False, allow_blank=False)
    role = serializers.CharField(required=False, allow_blank=False)
    title = serializers.CharField(required=False, allow_blank=False)
    overview = serializers.CharField(required=False, allow_blank=True)
    responsibilities = serializers.CharField(required=False, allow_blank=True)
    contributions = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    start_date = serializers.DateField(required=False)
    end_date = serializers.DateField(required=False, allow_null=True)
    employer = serializers.CharField(required=False, allow_blank=False)
    client = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    is_published = serializers.BooleanField(required=False, default=True)
    order = serializers.IntegerField(required=False, min_value=0)
    urls = serializers.ListField(required=False, child=serializers.DictField(), default=list)

    def _get_or_create_organization(self, name):
        if not name:
            return None
        return Organization.objects.get_or_create(name=name.strip(), defaults={"website_url": None})[0]

    def _upsert_translation(self, experience, validated_data):
        ExperienceTranslation.objects.update_or_create(
            experience=experience,
            language_code="en",
            defaults={
                "title": validated_data.get("title") or experience.role,
                "overview": validated_data.get("overview") or "",
                "responsibilities": validated_data.get("responsibilities") or "",
                "contributions": validated_data.get("contributions"),
            },
        )

    def _sync_urls(self, experience, urls):
        if urls is None:
            return

        ExperienceURL.objects.filter(experience=experience).delete()
        for index, item in enumerate(urls):
            if not item.get("url"):
                continue
            ExperienceURL.objects.create(
                experience=experience,
                url_type=item.get("url_type", "other"),
                label=item.get("label") or "Link",
                url=item["url"],
                order=item.get("order", index),
            )

    def create(self, validated_data):
        employer_name = validated_data.get("employer") or "Portfolio"
        employer_org = self._get_or_create_organization(employer_name)
        client_name = validated_data.get("client")
        client_org = self._get_or_create_organization(client_name) if client_name else None

        employment = Employment.objects.create(
            employer=employer_org,
            client=client_org,
            start_date=validated_data.get("start_date") or validated_data.get("end_date") or "2024-01-01",
            end_date=validated_data.get("end_date"),
            employment_type="full_time",
            order=validated_data.get("order", 0),
        )

        experience = Experience.objects.create(
            employment=employment,
            slug=validated_data.get("slug") or (validated_data.get("role") or "experience").lower().replace(" ", "-"),
            role=validated_data.get("role") or "Portfolio experience",
            start_date=validated_data.get("start_date") or validated_data.get("end_date") or "2024-01-01",
            end_date=validated_data.get("end_date"),
            is_published=validated_data.get("is_published", True),
            order=validated_data.get("order", 0),
        )
        self._upsert_translation(experience, validated_data)
        self._sync_urls(experience, validated_data.get("urls", []))
        return experience

    def update(self, instance, validated_data):
        if "employer" in validated_data or "client" in validated_data or "start_date" in validated_data or "end_date" in validated_data:
            employment = instance.employment
            if "employer" in validated_data and validated_data.get("employer"):
                employment.employer = self._get_or_create_organization(validated_data["employer"])
            if "client" in validated_data and validated_data.get("client"):
                employment.client = self._get_or_create_organization(validated_data["client"])
            if "start_date" in validated_data:
                employment.start_date = validated_data["start_date"]
            if "end_date" in validated_data:
                employment.end_date = validated_data["end_date"]
            employment.save()

        instance.slug = validated_data.get("slug", instance.slug)
        instance.role = validated_data.get("role", instance.role)
        instance.start_date = validated_data.get("start_date", instance.start_date)
        instance.end_date = validated_data.get("end_date", instance.end_date)
        instance.is_published = validated_data.get("is_published", instance.is_published)
        instance.order = validated_data.get("order", instance.order)
        instance.save()

        if "title" in validated_data or "overview" in validated_data or "responsibilities" in validated_data or "contributions" in validated_data:
            self._upsert_translation(instance, {**validated_data, "title": validated_data.get("title", instance.role), "overview": validated_data.get("overview", ""), "responsibilities": validated_data.get("responsibilities", "")})

        if "urls" in validated_data:
            self._sync_urls(instance, validated_data["urls"])

        return instance


class AdminSkillSerializer(serializers.Serializer):
    name = serializers.CharField(required=False, allow_blank=False)
    slug = serializers.SlugField(required=False, allow_blank=False)
    category = serializers.ChoiceField(required=False, choices=[choice[0] for choice in Skill.CATEGORY_CHOICES])
    display_name = serializers.CharField(required=False, allow_blank=False)
    description = serializers.CharField(required=False, allow_blank=True)
    duration_months = serializers.IntegerField(required=False, allow_null=True, min_value=0)
    is_featured = serializers.BooleanField(required=False, default=False)
    order = serializers.IntegerField(required=False, min_value=0)

    def _upsert_translation(self, skill, validated_data):
        SkillTranslation.objects.update_or_create(
            skill=skill,
            language_code="en",
            defaults={
                "display_name": validated_data.get("display_name") or skill.name,
                "description": validated_data.get("description") or "",
            },
        )

    def create(self, validated_data):
        skill = Skill.objects.create(
            name=validated_data.get("name") or "New skill",
            slug=validated_data.get("slug") or (validated_data.get("name") or "new-skill").lower().replace(" ", "-"),
            category=validated_data.get("category", "other"),
            duration_months=validated_data.get("duration_months"),
            is_featured=validated_data.get("is_featured", False),
            order=validated_data.get("order", 0),
        )
        self._upsert_translation(skill, validated_data)
        return skill

    def update(self, instance, validated_data):
        instance.name = validated_data.get("name", instance.name)
        instance.slug = validated_data.get("slug", instance.slug)
        instance.category = validated_data.get("category", instance.category)
        instance.duration_months = validated_data.get("duration_months", instance.duration_months)
        instance.is_featured = validated_data.get("is_featured", instance.is_featured)
        instance.order = validated_data.get("order", instance.order)
        instance.save()
        if "display_name" in validated_data or "description" in validated_data:
            self._upsert_translation(instance, {**validated_data, "display_name": validated_data.get("display_name", instance.name), "description": validated_data.get("description", "")})
        return instance
