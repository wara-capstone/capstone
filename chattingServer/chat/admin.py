from django.contrib import admin
from .models import ShopUser, VisitorUser, ChatRoom, Message

# ShopUser 모델에 대한 admin
class ShopUserAdmin(admin.ModelAdmin):
    list_display = ('id', 'shop_user_email')
    search_fields = ('shop_user_email',)

admin.site.register(ShopUser, ShopUserAdmin)

# VisitorUser 모델에 대한 admin
class VisitorUserAdmin(admin.ModelAdmin):
    list_display = ('id', 'visitor_user_email')
    search_fields = ('visitor_user_email',)

admin.site.register(VisitorUser, VisitorUserAdmin)

# ChatRoom 모델에 대한 admin
class ChatRoomAdmin(admin.ModelAdmin):
    list_display = ('id', 'shop_user', 'visitor_user', 'timestamp')
    search_fields = ('shop_user__shop_user_email', 'visitor_user__visitor_user_email')
    list_filter = ('timestamp',)

admin.site.register(ChatRoom, ChatRoomAdmin)

# Message 모델에 대한 admin
class MessageAdmin(admin.ModelAdmin):
    list_display = ('id', 'room', 'sender_email', 'text', 'timestamp')
    search_fields = ('room__id', 'sender_email')
    list_filter = ('timestamp',)

admin.site.register(Message, MessageAdmin)
