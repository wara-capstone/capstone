from rest_framework import generics, serializers, status
from rest_framework.response import Response
from .models import ChatRoom, Message, ShopUser, VisitorUser
from .serializers import ChatRoomSerializer, MessageSerializer
from rest_framework.exceptions import ValidationError
from django.http import Http404

from django.http import JsonResponse
from py_eureka_client import eureka_client

from django.conf import settings


# def health(request):
#     return JsonResponse({"status": "UP"})


# def register_service():
#     instance_port = int(settings.EUREKA_SERVICE['instance']['port']['$'])
#     eureka_client.init(eureka_server=settings.EUREKA_SERVER_URL,
#                     app_name=settings.EUREKA_SERVICE['instance']['app'],
#                     instance_port=instance_port)

# def deregister_service_from_eureka():
#     eureka_client.stop()

    
class ImmediateResponseException(Exception):
    def __init__(self, response):
        self.response = response

class ChatRoomListCreateView(generics.ListCreateAPIView):
    serializer_class = ChatRoomSerializer

    def get_queryset(self):
        try:
            user_email = self.request.query_params.get('email', None)

            if not user_email:
                raise ValidationError('Email 파라미터가 필요합니다.')

            return ChatRoom.objects.filter(
                shop_user__shop_user_email=user_email
            ) | ChatRoom.objects.filter(
                visitor_user__visitor_user_email=user_email
            )
        except ValidationError as e:
            # ValidationError가 발생하면 400 응답을 반환합니다
            content = {'detail': e.detail}
            return Response(content, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            # 다른 종류의 예외가 발생하면, 로그를 남기고 400 응답을 반환합니다
            # 여기에서 예외를 로그로 남길 수 있습니다
            content = {'detail': str(e)}
            return Response(content, status=status.HTTP_400_BAD_REQUEST)

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







class MessageListView(generics.ListAPIView):
    serializer_class = MessageSerializer

    def get_queryset(self):
        room_id = self.kwargs.get('room_id')
        
        if not room_id:
            # room_id가 제공되지 않았을 때
            content = {'detail': 'room_id 파라미터가 필요합니다.'}
            return Response(content, status=status.HTTP_400_BAD_REQUEST)

        queryset = Message.objects.filter(room_id=room_id)
        
        if not queryset.exists():
            # 메시지가 존재하지 않을 때
            raise Http404('해당 room_id로 메시지를 찾을 수 없습니다.')

        return queryset
