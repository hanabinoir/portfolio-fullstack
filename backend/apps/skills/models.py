from django.db import models

from apps.common.models import LANGUAGE_CODE_CHOICES, UUIDModel


class Skill(UUIDModel):
    CATEGORY_CHOICES = [
        ("language", "Language"),
        ("framework", "Framework"),
        ("tool", "Tool"),
        ("os", "Operating System"),
        ("cloud", "Cloud"),
        ("database", "Database"),
        ("other", "Other"),
    ]

    name = models.CharField(max_length=120)
    slug = models.SlugField(max_length=120, unique=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default="other")
    duration_months = models.PositiveIntegerField(null=True, blank=True)
    is_featured = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "name"]

    def __str__(self):
        return self.name


class SkillTranslation(UUIDModel):
    skill = models.ForeignKey(Skill, related_name="translations", on_delete=models.CASCADE)
    language_code = models.CharField(max_length=10, choices=LANGUAGE_CODE_CHOICES, default="en")
    display_name = models.CharField(max_length=200)
    description = models.TextField(blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["skill", "language_code"], name="unique_skill_language"),
        ]

    def __str__(self):
        return f"{self.skill} / {self.language_code}"


class SkillSourceClaim(UUIDModel):
    REVIEW_STATUS_CHOICES = [
        ("pending", "Pending"),
        ("accepted", "Accepted"),
        ("rejected", "Rejected"),
    ]

    skill = models.ForeignKey(Skill, related_name="source_claims", on_delete=models.CASCADE)
    source_language = models.CharField(max_length=10, choices=LANGUAGE_CODE_CHOICES, default="en")
    source_document = models.CharField(max_length=100, help_text="e.g. EN CV, JP CV")
    original_name = models.CharField(max_length=200)
    original_duration_text = models.CharField(max_length=200, blank=True, null=True)
    notes = models.TextField(blank=True)
    review_status = models.CharField(max_length=20, choices=REVIEW_STATUS_CHOICES, default="pending")

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.original_name} ({self.source_document})"
