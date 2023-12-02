from django.contrib import admin
from .models import ShopUser, VisitorUser, ChatRoom, Message

@admin.register(ShopUser)
class ShopUserAdmin(admin.ModelAdmin):
    list_display = ('id', 'shop_user_email')
    search_fields = ('shop_user_email',)

@admin.register(VisitorUser)
class VisitorUserAdmin(admin.ModelAdmin):
    list_display = ('id', 'visitor_user_email')
    search_fields = ('visitor_user_email',)

@admin.register(ChatRoom)
class ChatRoomAdmin(admin.ModelAdmin):
    list_display = ('id', 'get_shop_user_email', 'get_visitor_user_email', 'timestamp')
    search_fields = ('shop_user__shop_user_email', 'visitor_user__visitor_user_email')
    list_filter = ('timestamp',)

    def get_shop_user_email(self, obj):
        return obj.shop_user.shop_user_email
    get_shop_user_email.admin_order_field = 'shop_user'
    get_shop_user_email.short_description = 'Shop User Email'

    def get_visitor_user_email(self, obj):
        return obj.visitor_user.visitor_user_email
    get_visitor_user_email.admin_order_field = 'visitor_user'
    get_visitor_user_email.short_description = 'Visitor User Email'

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('id', 'get_room_id', 'sender_email', 'text', 'timestamp')
    search_fields = ('room__id', 'sender_email')
    list_filter = ('timestamp',)

    def get_room_id(self, obj):
        return obj.room.id
    get_room_id.admin_order_field = 'room'
    get_room_id.short_description = 'Chat Room ID'
