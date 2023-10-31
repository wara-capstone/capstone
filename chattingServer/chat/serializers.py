from rest_framework import serializers
from .models import ChatRoom, Message

class ChatRoomSerializer(serializers.ModelSerializer):
    latest_message = serializers.SerializerMethodField()
    opponent_email = serializers.SerializerMethodField()
    shop_user_email = serializers.SerializerMethodField()  # 추가된 필드
    visitor_user_email = serializers.SerializerMethodField()  # 추가된 필드

    class Meta:
        model = ChatRoom
        fields = ('id', 'shop_user_email', 'visitor_user_email', 'latest_message', 'opponent_email')  # shop_user와 visitor_user를 제거하고 새로운 email 필드를 추가

    def get_latest_message(self, obj):
        latest_msg = Message.objects.filter(room=obj).order_by('-timestamp').first()
        if latest_msg:
            return latest_msg.text
        return None

    def get_opponent_email(self, obj):
        request_user_email = self.context['request'].query_params.get('email', None)
        if request_user_email == obj.shop_user.shop_user_email:
            return obj.visitor_user.visitor_user_email
        else:
            return obj.shop_user.shop_user_email

    def get_shop_user_email(self, obj):  # shop_user의 email을 반환하는 메소드
        return obj.shop_user.shop_user_email

    def get_visitor_user_email(self, obj):  # visitor_user의 email을 반환하는 메소드
        return obj.visitor_user.visitor_user_email


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = "__all__"
