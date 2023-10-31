from django.urls import path
from chat import views

urlpatterns = [
    path('rooms/', views.RoomListCreateAPIView.as_view(), name='room-list-create'),
    path('rooms/<int:pk>/', views.RoomDetailAPIView.as_view(), name='room-detail'),
    path('rooms/<int:room_pk>/users/', views.room_users, name='room-users'),
]
