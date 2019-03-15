"""
Provides the upload endpoint for the django storage backend.
"""
from django.contrib.auth.decorators import login_required
from django.shortcuts import HttpResponse
from django.views.decorators.http import require_http_methods

from .backends.django_storage import Backend


@login_required()
@require_http_methods(["PUT"])
def django_storage(request, key, file_ext):
    """
    Upload files using django storage backend.
    """
    key_file_ext = '{key}{ext}'.format(key=key, ext=file_ext)
    Backend().upload_file(key_file_ext, request.body)
    return HttpResponse()
