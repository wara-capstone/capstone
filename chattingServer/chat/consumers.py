from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async
from .models import ShopUser, VisitorUser, ChatRoom, Message

class ChatConsumer(AsyncJsonWebsocketConsumer):

    async def connect(self):
        self.room_id = self.scope['url_route']['kwargs']['room_id']  # room_name 대신 room_id 사용
        group_name = self.get_group_name(self.room_id)
        await self.channel_layer.group_add(group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        group_name = self.get_group_name(self.room_id)
        await self.channel_layer.group_discard(group_name, self.channel_name)

    async def receive_json(self, content):
        message = content['message']
        shop_user_email = content['shop_user_email']
        visitor_user_email = content['visitor_user_email']

        room = await self.get_or_create_room(shop_user_email, visitor_user_email)
        self.room_id = str(room.id)  # room의 id를 room_id로 설정
        group_name = self.get_group_name(self.room_id)
        await self.save_message(room, shop_user_email, message)

        await self.channel_layer.group_send(group_name, {
            'type': 'chat_message',
            'message': message
        })

    async def chat_message(self, event):
        message = event['message']
        await self.send_json({'message': message})

    @staticmethod
    def get_group_name(room_id):
        return f"chat_room_{room_id}"

    @database_sync_to_async
    def get_or_create_room(self, shop_user_email, visitor_user_email):
        shop_user, _ = ShopUser.objects.get_or_create(shop_user_email=shop_user_email)
        visitor_user, _ = VisitorUser.objects.get_or_create(visitor_user_email=visitor_user_email)
        room, _ = ChatRoom.objects.get_or_create(shop_user=shop_user, visitor_user=visitor_user)
        return room

    @database_sync_to_async
    def save_message(self, room, sender_email, message_text):
        Message.objects.create(room=room, sender_email=sender_email, text=message_text)
