# pylint: disable=import-error
"""
A module for containing various inline runtime fuction imports
Functions in this module should pass all args and kwargs through to the imported function, and should
generally attempt to be named the same as the imported function.

That way, calling these functions are essentially identical to calling the imported functions directly.
"""


def anonymous_id_for_user(*args, **kwargs):
    """
    Helper method that imports anonymous_id_for_user from edx platform at runtime and calls it with the given args.
    """
    from common.djangoapps.student.models import anonymous_id_for_user as imported_anonymous_id_for_user
    return imported_anonymous_id_for_user(*args, **kwargs)


def get_user_by_username_or_email(*args, **kwargs):
    """
    Helper method that imports get_user_by_username_or_email from edx platform at runtime
    and calls it with the given args.
    """
    from common.djangoapps.student.models.user import (
        get_user_by_username_or_email as imported_get_user_by_username_or_email,
    )
    return imported_get_user_by_username_or_email(*args, **kwargs)


def get_course_blocks(*args, **kwargs):
    """
    Helper method that imports get_course_blocks from edx platform at runtime and calls it with the given args.
    """
    from lms.djangoapps.course_blocks.api import get_course_blocks as imported_get_course_blocks
    return imported_get_course_blocks(*args, **kwargs)


def reset_student_attempts(*args, **kwargs):
    """
    Helper method that imports reset_student_attempts from edx platform at runtime
    and calls it with the given args.
    """
    from lms.djangoapps.instructor.enrollment import (
        reset_student_attempts as imported_reset_student_attempts
    )
    return imported_reset_student_attempts(*args, **kwargs)


def modulestore(*args, **kwargs):
    """
    Helper method that imports modulestore from edx platform at runtime and calls it with the given args.
    """
    from xmodule.modulestore.django import modulestore as imported_modulestore
    return imported_modulestore(*args, **kwargs)
