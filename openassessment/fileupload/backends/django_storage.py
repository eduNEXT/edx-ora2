"""
Django-storage backend module.

Creates the file alongs with a .meta file that contains info about the file saved.
"""

import json
import mimetypes
import os

from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from django.core.urlresolvers import reverse

from .base import BaseBackend


class Backend(BaseBackend):
    """
    Manage openassessment student files uploaded using the default django storage settings.
    """
    METADATA_FILE_EXTENSION = '.meta'

    def get_upload_url(self, key, content_type):
        """
        Return the URL pointing to the ORA2 django storage upload endpoint.
        """
        file_extension = get_file_extension(content_type)
        parameters = {
            'key': key,
            'file_ext': file_extension,
        }

        return reverse("openassessment-django-storage", kwargs=parameters)

    def get_download_url(self, key):
        """
        Return the django storage download URL for the given key.

        Returns None if no file exists at that location.
        """
        path = self._get_file_path(key)
        metadata_path = '{path}{ext}'.format(path=path, ext=self.METADATA_FILE_EXTENSION)

        # Checks that .meta file exists for this key.
        if default_storage.exists(metadata_path):
            metadata_file = default_storage.open(metadata_path).read()
            metadata_dict = get_metadata_dict(metadata_file)
            path_file_ext = '{path}{ext}'.format(path=path, ext=metadata_dict['ext'])

            if default_storage.exists(path_file_ext):
                return default_storage.url(path_file_ext)

        if default_storage.exists(path):
            return default_storage.url(path)
        return None

    def upload_file(self, key, content, file_ext):
        """
        Upload the given file content to the keyed location.
        """
        path = self._get_file_path(key)
        path_file_ext = '{path}{ext}'.format(path=path, ext=file_ext)
        metadata_dict = {
            "ext": file_ext
        }
        metadata_file = ContentFile(json.dumps(metadata_dict))
        metadata_path = '{path}{ext}'.format(path=path, ext=self.METADATA_FILE_EXTENSION)

        saved_path = default_storage.save(path_file_ext, ContentFile(content))
        # Saves the .meta file with the same file key.
        default_storage.save(metadata_path, metadata_file)
        return saved_path

    def remove_file(self, key):
        """
        Remove the file at the given keyed location.

        Returns True if the file exists, and was removed.
        Returns False if the file does not exist, and so was not removed.
        """
        path = self._get_file_path(key)
        metadata_path = '{path}{ext}'.format(path=path, ext=self.METADATA_FILE_EXTENSION)

        # Checks that .meta file exists for this key.
        if default_storage.exists(metadata_path):
            metadata_file = default_storage.open(metadata_path).read()
            metadata_dict = get_metadata_dict(metadata_file)
            path_file_ext = '{path}{ext}'.format(path=path, ext=metadata_dict['ext'])
            # Removes the .meta file too.
            default_storage.delete(metadata_path)

            if default_storage.exists(path_file_ext):
                default_storage.delete(path_file_ext)
                return True

        if default_storage.exists(path):
            default_storage.delete(path)
            return True
        return False

    def _get_file_name(self, key):
        """
        Returns the name of the keyed file.

        Since the backend storage may be folders, or it may use pseudo-folders,
        make sure the filename doesn't include any path separators.
        """
        file_name = key.replace("..", "").strip("/ ")
        file_name = file_name.replace(os.sep, "_")
        return file_name

    def _get_file_path(self, key):
        """
        Returns the path to the keyed file, including the storage prefix.
        """
        path = self._get_key_name(self._get_file_name(key))
        return path


def get_file_extension(content_type):
    """
    Return the correct file extension depending on content_type.
    """
    extension = mimetypes.guess_all_extensions(content_type)
    if extension:
        return extension[0]

    raise ValueError('Unknown content type file.')


def get_metadata_dict(metadata_file):
    """
    Return a python dict object from metadata_file.
    """
    try:
        metadata_dict = json.loads(metadata_file)
        return metadata_dict
    except ValueError:
        raise ValueError('Metadata contents could not be loaded correctly.')
