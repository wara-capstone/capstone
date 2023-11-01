from rest_framework import generics, serializers, status
from rest_framework.response import Response
from django.db.models import Q
from .models import ChatRoom, Message, ShopUser, VisitorUser
from .serializers import ChatRoomSerializer, MessageSerializer


class ImmediateResponseException(Exception):
    def __init__(self, response):
        self.response = response

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
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            self.perform_create(serializer)
        except ImmediateResponseException as e:
            return e.response
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        shop_user_email = self.request.data.get('shop_user_email')
        visitor_user_email = self.request.data.get('visitor_user_email')

        shop_user, _ = ShopUser.objects.get_or_create(shop_user_email=shop_user_email)
        visitor_user, _ = VisitorUser.objects.get_or_create(visitor_user_email=visitor_user_email)
        
        # 이미 존재하는 채팅방 확인
        # 이미 존재하는 채팅방 확인
        existing_chatroom = ChatRoom.objects.filter(shop_user__shop_user_email=shop_user_email, visitor_user__visitor_user_email=visitor_user_email).first()

        if existing_chatroom:
            # 이미 존재하는 채팅방이 있다면 해당 채팅방과 메시지 내역을 반환
            serializer = ChatRoomSerializer(existing_chatroom, context={'request': self.request})
            raise ImmediateResponseException(Response(serializer.data, status=status.HTTP_200_OK))

        
        serializer.save(shop_user=shop_user, visitor_user=visitor_user)







class MessageListView(generics.ListAPIView):  # ListAPIView를 사용하여 메시지 조회만 가능하게 합니다.
    serializer_class = MessageSerializer

    def get_queryset(self):
        room_id = self.kwargs.get('room_id')
        return Message.objects.filter(room_id=room_id)
