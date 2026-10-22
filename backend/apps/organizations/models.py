from django.db import models

from apps.common.models import LANGUAGE_CODE_CHOICES, UUIDModel


class Organization(UUIDModel):
    name = models.CharField(max_length=200)
    website_url = models.URLField(max_length=500, blank=True, null=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class OrganizationTranslation(UUIDModel):
    organization = models.ForeignKey(Organization, related_name="translations", on_delete=models.CASCADE)
    language_code = models.CharField(max_length=10, choices=LANGUAGE_CODE_CHOICES, default="en")
    display_name = models.CharField(max_length=200)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["organization", "language_code"], name="unique_organization_language"),
        ]

    def __str__(self):
        return f"{self.organization} / {self.language_code}"
