from django.contrib import admin
from .models import Cart, CartItem

@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('id', 'user_email')  # 어드민 리스트에 보여질 필드
    search_fields = ('user_email',)  # 검색 필드 설정
    ordering = ('user_email',)  # 기본 정렬 필드 설정

@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'cart', 'product_id', 'store_id','size','color','quantity','price')  # 어드민 리스트에 보여질 필드
    list_select_related = ('cart',)  # ForeignKey 관계 최적화
    search_fields = ('cart__user_email', 'product_id')  # ForeignKey를 통한 검색 설정
    ordering = ('cart', 'product_id', 'store_id')  # 기본 정렬 필드 설정

    def get_queryset(self, request):
        # ForeignKey 관계의 필드를 가져올 때 쿼리 최적화
        qs = super().get_queryset(request)
        return qs.select_related('cart')
