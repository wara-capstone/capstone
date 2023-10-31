from rest_framework import serializers
from .models import ChatRoom, Message

class ChatRoomSerializer(serializers.ModelSerializer):
    latest_message = serializers.SerializerMethodField()
    opponent_email = serializers.SerializerMethodField()

    class Meta:
        model = ChatRoom
        fields = ('id', 'shop_user', 'visitor_user', 'latest_message', 'opponent_email')

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


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = "__all__"
