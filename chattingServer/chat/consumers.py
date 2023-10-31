from channels.generic.websocket import JsonAsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import ShopUser, VisitorUser, ChatRoom, Message

class ChatConsumer(JsonAsyncWebsocketConsumer):

    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        await self.channel_layer.group_add(self.room_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_name, self.channel_name)
        # 사용자가 웹소켓에서 나갈 때의 로직 추가
        shop_user_email = self.scope.get('user_email')  # 프론트엔드에서 이메일을 전달해야 함
        visitor_user_email = self.scope.get('visitor_user_email')  # 프론트엔드에서 이메일을 전달해야 함

        if shop_user_email and visitor_user_email:
            room = await self.get_or_create_room(shop_user_email, visitor_user_email)

            # 사용자가 나갔음을 처리하는 로직 추가
            await self.user_left(room, shop_user_email)
            
    async def receive_json(self, content):
        message = content['message']
        shop_user_email = content['shop_user_email']
        visitor_user_email = content['visitor_user_email']

        room = await self.get_or_create_room(shop_user_email, visitor_user_email)
        await self.save_message(room, shop_user_email, message)

        await self.channel_layer.group_send(self.room_name, {
            'type': 'chat_message',
            'message': message
        })

    async def chat_message(self, event):
        message = event['message']
        await self.send_json({'message': message})

    @database_sync_to_async
    def get_or_create_room(self, shop_user_email, visitor_user_email):
        shop_user, _ = ShopUser.objects.get_or_create(shop_user_email=shop_user_email)
        visitor_user, _ = VisitorUser.objects.get_or_create(visitor_user_email=visitor_user_email)
        room, _ = ChatRoom.objects.get_or_create(shop_user=shop_user, visitor_user=visitor_user)
        return room

    @database_sync_to_async
    def save_message(self, room, sender_email, message_text):
        Message.objects.create(room=room, sender_email=sender_email, text=message_text)
