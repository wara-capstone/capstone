from rest_framework import serializers
from .models import Cart, CartItem, Product

class CartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cart
        fields = ['user_email']

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['p_id', 'p_name','size', 'color', 'quantity', 'price']

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer()
    cart_item_id = serializers.IntegerField(source='id', read_only=True)

    class Meta:
        model = CartItem
        fields = ['cart', 'cart_item_id', 'store_id', 'product']



    def create(self, validated_data):
        product_data = validated_data.pop('product')
        product_serializer = ProductSerializer(data=product_data)
        if product_serializer.is_valid(raise_exception=True):
            validated_data['product'] = product_serializer.save()
        cart_item = CartItem.objects.create(**validated_data)
        return cart_item


    def update(self, instance, validated_data):
        product_data = validated_data.pop('product')
        product_serializer = ProductSerializer(instance.product, data=product_data)
        if product_serializer.is_valid():
            product_serializer.save()

        return super(CartItemSerializer, self).update(instance, validated_data)
