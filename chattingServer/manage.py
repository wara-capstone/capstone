#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys

def register_to_eureka():
    from chatting.views import register_service
    register_service()

def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    register_to_eureka()  # Eureka에 서비스 등록 내부로 이동
    execute_from_command_line(sys.argv)

if __name__ == '__main__':
    main()





# #!/usr/bin/env python
# """Django's command-line utility for administrative tasks."""
# import os
# import sys

# def register_to_eureka():
#     from chatting.views import register_service
#     register_service()

# def main():
#     """Run administrative tasks."""
#     os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
#     try:
#         from django.core.management import execute_from_command_line
#     except ImportError as exc:
#         raise ImportError(
#             "Couldn't import Django. Are you sure it's installed and "
#             "available on your PYTHONPATH environment variable? Did you "
#             "forget to activate a virtual environment?"
#         ) from exc
#     execute_from_command_line(sys.argv)


# if __name__ == '__main__':
#     register_to_eureka()  # Eureka에 서비스 등록
#     main()
