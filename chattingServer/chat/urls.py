from django.urls import path
from . import views
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="Chat API",
        default_version='v1',
        description="Chat API documentation",
        contact=openapi.Contact(email="qzqzcaraz00t@gmail.com"),
        license=openapi.License(name="MJ License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('rooms/', views.ChatRoomListCreateView.as_view(), name='chat_rooms'),
    path('<int:room_id>/messages', views.MessageListView.as_view(), name='chat_messages'),

    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]
