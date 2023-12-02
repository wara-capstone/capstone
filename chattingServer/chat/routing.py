from django.urls import path

from chat import consumers

websocket_urlpatterns = [
    path("api/ws/room/<int:room_id>/messages", consumers.ChatConsumer.as_asgi()),
]

