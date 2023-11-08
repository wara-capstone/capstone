"""
WSGI config for config project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/wsgi/
"""

import os
import atexit
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

# WSGI 애플리케이션을 초기화합니다.
application = get_wsgi_application()

# channels 라우팅과 미들웨어는 Django 초기화 이후에 가져와야 합니다.
# 여기서 필요한 추가적인 imports를 수행할 수 있습니다.

# 서비스 등록을 수행합니다.
from cart.views import register_service, deregister_service_from_eureka
register_service()

# 프로세스가 종료될 때 서비스 등록을 해제합니다.
atexit.register(deregister_service_from_eureka)
