from django.contrib import admin
from .models import Store, Cart, Size, Color, Product, CartItem

# Register your models here.
@admin.register(Store)
class StoreAdmin(admin.ModelAdmin):
    list_display = ('store_id',)  
    search_fields = ('store_id',)  

@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('id', 'store', 'user_email', 'date_added')  
    list_filter = ('date_added', 'store')  
    search_fields = ('user_email',) 

@admin.register(Size)
class SizeAdmin(admin.ModelAdmin):
    list_display = ('size',) 
    search_fields = ('size',)  

@admin.register(Color)
class ColorAdmin(admin.ModelAdmin):
    list_display = ('color',)  
    search_fields = ('color',) 

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('product_id', 'name', 'price')  
    list_filter = ('size', 'color') 
    search_fields = ('name',)  

@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ('cart', 'product', 'quantity', 'sub_total')  
    list_filter = ('cart', 'product')  

    def sub_total(self, obj):
        return obj.sub_total()  
    sub_total.short_description = 'Subtotal'  

