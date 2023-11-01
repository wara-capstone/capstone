from rest_framework import generics
from .models import ChatRoom, Message, ShopUser, VisitorUser
from .serializers import ChatRoomSerializer, MessageSerializer

from rest_framework import generics, status
from rest_framework.response import Response
from .models import ChatRoom, Message, ShopUser, VisitorUser
from .serializers import ChatRoomSerializer, MessageSerializer

class ChatRoomListCreateView(generics.ListCreateAPIView):
    serializer_class = ChatRoomSerializer

    def get_queryset(self):
        user_email = self.request.query_params.get('email', None)
        if not user_email:
            return ChatRoom.objects.none()
        return ChatRoom.objects.filter(shop_user__shop_user_email=user_email) | ChatRoom.objects.filter(visitor_user__visitor_user_email=user_email)

    def get_serializer_context(self):
        context = super(ChatRoomListCreateView, self).get_serializer_context()
        context['request'] = self.request
        return context
    
    def create(self, request, *args, **kwargs):
        response = super(ChatRoomListCreateView, self).create(request, *args, **kwargs)
        if response.status_code == status.HTTP_201_CREATED:
            return Response({"result": "success"}, status=status.HTTP_201_CREATED)
        else:
            return Response({"result": "failed"}, status=status.HTTP_400_BAD_REQUEST)
    
    def perform_create(self, serializer):
        shop_user_email = self.request.data.get('shop_user_email')
        visitor_user_email = self.request.data.get('visitor_user_email')

        shop_user, _ = ShopUser.objects.get_or_create(shop_user_email=shop_user_email)
        visitor_user, _ = VisitorUser.objects.get_or_create(visitor_user_email=visitor_user_email)

        serializer.save(shop_user=shop_user, visitor_user=visitor_user)




class MessageListView(generics.ListAPIView):  # ListAPIView를 사용하여 메시지 조회만 가능하게 합니다.
    serializer_class = MessageSerializer

    def get_queryset(self):
        room_id = self.kwargs.get('room_id')
        return Message.objects.filter(room_id=room_id)
