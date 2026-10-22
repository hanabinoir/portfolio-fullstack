from django.db import models

from apps.common.models import LANGUAGE_CODE_CHOICES, UUIDModel


class Profile(UUIDModel):
    profile_picture_url = models.URLField(max_length=500, blank=True, null=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.get_default_name() or str(self.pk)

    def get_default_name(self):
        translation = self.translations.filter(language_code="en").first()
        return translation.display_name if translation else None


class ProfileTranslation(UUIDModel):
    profile = models.ForeignKey(Profile, related_name="translations", on_delete=models.CASCADE)
    language_code = models.CharField(max_length=10, choices=LANGUAGE_CODE_CHOICES, default="en")
    display_name = models.CharField(max_length=200)
    headline = models.CharField(max_length=250, blank=True)
    summary = models.TextField(blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["profile", "language_code"], name="unique_profile_language"),
        ]
        ordering = ["language_code"]

    def __str__(self):
        return f"{self.profile_id} / {self.language_code}"


class ProfileLink(UUIDModel):
    LINK_TYPE_CHOICES = [
        ("website", "Website"),
        ("github", "GitHub"),
        ("linkedin", "LinkedIn"),
        ("portfolio", "Portfolio"),
        ("other", "Other"),
    ]

    profile = models.ForeignKey(Profile, related_name="links", on_delete=models.CASCADE)
    link_type = models.CharField(max_length=20, choices=LINK_TYPE_CHOICES, default="website")
    label = models.CharField(max_length=100)
    url = models.URLField(max_length=500)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "label"]

    def __str__(self):
        return f"{self.label} ({self.link_type})"


class SpokenLanguage(UUIDModel):
    canonical_name = models.CharField(max_length=100)
    code = models.CharField(max_length=20, unique=True)
    is_default = models.BooleanField(default=False)

    class Meta:
        ordering = ["canonical_name"]

    def __str__(self):
        return self.canonical_name


class SpokenLanguageTranslation(UUIDModel):
    spoken_language = models.ForeignKey(SpokenLanguage, related_name="translations", on_delete=models.CASCADE)
    language_code = models.CharField(max_length=10, choices=LANGUAGE_CODE_CHOICES, default="en")
    label = models.CharField(max_length=100)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["spoken_language", "language_code"], name="unique_spoken_language_translation"),
        ]

    def __str__(self):
        return f"{self.spoken_language_id} / {self.language_code}"


class ProfileSpokenLanguage(UUIDModel):
    PROFICIENCY_CHOICES = [
        ("native", "Native"),
        ("business", "Business"),
        ("professional", "Professional"),
        ("conversational", "Conversational"),
    ]

    profile = models.ForeignKey(Profile, related_name="spoken_languages", on_delete=models.CASCADE)
    spoken_language = models.ForeignKey(SpokenLanguage, related_name="profiles", on_delete=models.CASCADE)
    proficiency_level = models.CharField(max_length=20, choices=PROFICIENCY_CHOICES, default="business")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["profile", "spoken_language"], name="unique_profile_spoken_language"),
        ]
        ordering = ["order", "spoken_language__canonical_name"]

    def __str__(self):
        return f"{self.profile_id} - {self.spoken_language}"
