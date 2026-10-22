from collections.abc import Iterable

from apps.common.models import LANGUAGE_CODE_CHOICES


def get_requested_language(request=None, value=None, default="en"):
    if value is not None:
        candidate = str(value).strip().lower()
    elif request is not None:
        candidate = str(request.query_params.get("lang", default)).strip().lower()
    else:
        candidate = default

    valid_codes = {code for code, _ in LANGUAGE_CODE_CHOICES}
    if candidate in valid_codes:
        return candidate
    return default


def get_translation_for(obj, requested_language, related_name="translations"):
    translations = getattr(obj, related_name, None)
    if translations is None:
        return None

    translation = translations.filter(language_code=requested_language).first()
    if translation is not None:
        return translation

    return translations.filter(language_code="en").first()


def ordered_items(items: Iterable, key_name: str = "order"):
    return sorted(items, key=lambda item: getattr(item, key_name, 0) or 0)
