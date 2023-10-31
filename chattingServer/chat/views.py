from rest_framework import generics  # DRF에서 제공하는 제네릭 뷰들을 가져옵니다.
from .models import ChatRoom, Message  # 현재 앱의 모델인 ChatRoom과 Message를 가져옵니다.
from .serializers import ChatRoomSerializer, MessageSerializer  # 현재 앱의 시리얼라이저를 가져옵니다.

class ChatRoomListCreateView(generics.ListCreateAPIView):  # 채팅방 목록 조회 및 생성을 위한 뷰입니다.
    serializer_class = ChatRoomSerializer  # 채팅방 데이터를 JSON으로 변환하기 위한 시리얼라이저를 지정합니다.

    def get_queryset(self):  # 이 뷰에서 사용할 쿼리셋을 반환하는 메서드입니다.
        user_email = self.request.query_params.get('email', None)  # 요청에서 'email' 쿼리 파라미터를 가져옵니다.
        if not user_email:
            return ChatRoom.objects.none()  # 이메일이 제공되지 않으면 빈 쿼리셋을 반환합니다.
        # 사용자의 이메일로 shop_user 또는 visitor_user를 필터링하여 채팅방 목록을 가져옵니다.
        return ChatRoom.objects.filter(shop_user__shop_user_email=user_email) | ChatRoom.objects.filter(visitor_user__visitor_user_email=user_email)

    def get_serializer_context(self):  # 시리얼라이저에 전달될 추가 컨텍스트를 반환하는 메서드입니다.
        # 기본 컨텍스트에 'request'를 추가하여 반환합니다.
        context = super(ChatRoomListCreateView, self).get_serializer_context()
        context['request'] = self.request
        return context

class MessageListCreateView(generics.ListCreateAPIView):  # 메시지 목록 조회 및 생성을 위한 뷰입니다.
    serializer_class = MessageSerializer  # 메시지 데이터를 JSON으로 변환하기 위한 시리얼라이저를 지정합니다.

    def get_queryset(self):  # 이 뷰에서 사용할 쿼리셋을 반환하는 메서드입니다.
        room_id = self.kwargs.get('room_id')  # 요청 URL에서 'room_id'를 가져옵니다.
        return Message.objects.filter(room_id=room_id)  # 해당 room_id에 해당하는 메시지 목록을 가져옵니다.
