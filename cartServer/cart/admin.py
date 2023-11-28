from django.contrib import admin
from .models import Cart, CartItem, Product

@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('id', 'user_email')
    search_fields = ('user_email',)
    ordering = ('user_email',)

@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ('get_cart_item_id', 'get_cart_of_user', 'store_id', 'get_product_id', 'get_product_name','get_size', 'get_color', 'get_quantity', 'get_price')
    list_select_related = ('cart', 'product')
    search_fields = ('cart__user_email', 'product__size', 'product__color', 'product__p_id')
    ordering = ('cart', 'product', 'store_id')

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('cart', 'product')

    def get_cart_item_id(self, obj):
        return obj.id
    get_cart_item_id.admin_order_field = 'id'
    get_cart_item_id.short_description = 'Cart Item ID'

    def get_cart_of_user(self, obj):
        return obj.cart.user_email
    get_cart_of_user.admin_order_field = 'cart__user_email'  # Allows column order sorting
    get_cart_of_user.short_description = 'Cart owner email'  # Column header

    def get_product_id(self, obj):
        return obj.product.p_id
    get_product_id.admin_order_field = 'product__p_id'
    get_product_id.short_description = 'Product ID'


    def get_product_name(self, obj):
        return obj.product.p_name
    get_product_id.admin_order_field = 'product__p_name'
    get_product_id.short_description = 'P_Name'


    def get_size(self, obj):
        return obj.product.size
    get_size.admin_order_field = 'product__size'
    get_size.short_description = 'Size'

    def get_color(self, obj):
        return obj.product.color
    get_color.admin_order_field = 'product__color'
    get_color.short_description = 'Color'

    def get_quantity(self, obj):
        return obj.product.quantity
    get_quantity.admin_order_field = 'product__quantity'
    get_quantity.short_description = 'Quantity'

    def get_price(self, obj):
        return obj.product.price
    get_price.admin_order_field = 'product__price'
    get_price.short_description = 'Price'
