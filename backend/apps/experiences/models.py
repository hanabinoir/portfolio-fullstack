from django.core.exceptions import ValidationError
from django.db import models

from apps.common.models import LANGUAGE_CODE_CHOICES, UUIDModel


class Employment(UUIDModel):
    EMPLOYMENT_TYPE_CHOICES = [
        ("full_time", "Full-time"),
        ("contract", "Contract"),
        ("dispatch", "Dispatch"),
        ("freelance", "Freelance"),
        ("other", "Other"),
    ]

    employer = models.ForeignKey("organizations.Organization", related_name="employments", on_delete=models.PROTECT)
    client = models.ForeignKey(
        "organizations.Organization",
        related_name="client_employments",
        on_delete=models.PROTECT,
        null=True,
        blank=True,
    )
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    employment_type = models.CharField(max_length=20, choices=EMPLOYMENT_TYPE_CHOICES, default="full_time")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "start_date"]
        constraints = [
            models.CheckConstraint(
                condition=models.Q(end_date__isnull=True) | models.Q(end_date__gte=models.F("start_date")),
                name="employment_end_date_after_start",
            )
        ]

    def clean(self):
        super().clean()
        if self.end_date and self.start_date and self.end_date < self.start_date:
            raise ValidationError({"end_date": "End date cannot be earlier than start date."})

    def __str__(self):
        return f"{self.employer} ({self.start_date} - {self.end_date or 'Present'})"


class Experience(UUIDModel):
    employment = models.ForeignKey(Employment, related_name="experiences", on_delete=models.PROTECT)
    slug = models.SlugField(max_length=120, unique=True)
    role = models.CharField(max_length=200)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    team_size = models.PositiveIntegerField(null=True, blank=True)
    is_published = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "start_date"]
        constraints = [
            models.CheckConstraint(
                condition=models.Q(end_date__isnull=True) | models.Q(end_date__gte=models.F("start_date")),
                name="experience_end_date_after_start",
            )
        ]

    def clean(self):
        super().clean()
        if self.end_date and self.start_date and self.end_date < self.start_date:
            raise ValidationError({"end_date": "End date cannot be earlier than start date."})

    def __str__(self):
        return self.role


class ExperienceTranslation(UUIDModel):
    experience = models.ForeignKey(Experience, related_name="translations", on_delete=models.CASCADE)
    language_code = models.CharField(max_length=10, choices=LANGUAGE_CODE_CHOICES, default="en")
    title = models.CharField(max_length=200)
    overview = models.TextField(blank=True)
    responsibilities = models.TextField()
    contributions = models.TextField(blank=True, null=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["experience", "language_code"], name="unique_experience_language"),
        ]

    def __str__(self):
        return f"{self.experience} / {self.language_code}"


class ExperienceURL(UUIDModel):
    URL_TYPE_CHOICES = [
        ("product", "Product"),
        ("demo", "Demo"),
        ("repository", "Repository"),
        ("case_study", "Case Study"),
        ("other", "Other"),
    ]

    experience = models.ForeignKey(Experience, related_name="urls", on_delete=models.CASCADE)
    url_type = models.CharField(max_length=20, choices=URL_TYPE_CHOICES, default="other")
    label = models.CharField(max_length=100)
    url = models.URLField(max_length=500)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "label"]

    def __str__(self):
        return f"{self.experience} / {self.url_type}"


class ExperiencePhase(UUIDModel):
    experience = models.ForeignKey(Experience, related_name="phases", on_delete=models.CASCADE)
    phase_name = models.CharField(max_length=100)
    phase_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["phase_order", "phase_name"]
        constraints = [
            models.UniqueConstraint(fields=["experience", "phase_order"], name="unique_experience_phase_order"),
        ]

    def __str__(self):
        return f"{self.experience} / {self.phase_name}"


class ExperienceSkill(UUIDModel):
    experience = models.ForeignKey(Experience, related_name="experience_skills", on_delete=models.CASCADE)
    skill = models.ForeignKey("skills.Skill", related_name="skill_experiences", on_delete=models.CASCADE)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["experience", "skill"], name="unique_experience_skill"),
        ]
        ordering = ["order", "skill__name"]

    def __str__(self):
        return f"{self.experience} - {self.skill}"

    def save(self, *args, **kwargs):
        if self.experience_id == self.skill_id:
            raise ValueError("Experience and skill cannot be the same object.")
        super().save(*args, **kwargs)
