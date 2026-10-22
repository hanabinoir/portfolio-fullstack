import uuid

from django.db import models

LANGUAGE_CODE_CHOICES = [
    ("en", "English"),
    ("ja", "Japanese"),
    ("ko", "Korean"),
    ("zh-hk", "Cantonese (Hong Kong)"),
]


class UUIDModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class LocalizedModel(models.Model):
    language_code = models.CharField(max_length=10, choices=LANGUAGE_CODE_CHOICES, default="en")

    class Meta:
        abstract = True
