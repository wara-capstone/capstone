from rest_framework import serializers
from .models import Cart, CartItem, Product, Size, Color, Store

class SizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Size
        fields = ['size']

class ColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Color
        fields = ['color']

class ProductSerializer(serializers.ModelSerializer):
    sizes = SizeSerializer(many=True, source='size')
    colors = ColorSerializer(many=True, source='color')

    class Meta:
        model = Product
        fields = ['id', 'name','price', 'sizes', 'colors']

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer()

    class Meta:
        model = CartItem
        fields = ['product', 'quantity']

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, source='cartitem_set')
    store_id = serializers.ReadOnlyField(source='store.id')

    class Meta:
        model = Cart
        fields = ['user_email', 'store_id', 'items']
