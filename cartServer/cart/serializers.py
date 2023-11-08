from rest_framework import serializers
from .models import Cart, CartItem

class CartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cart
        fields = ['user_email']

class CartItemSerializer(serializers.ModelSerializer):
    cart = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = CartItem
        fields = ['cart', 'product_id', 'store_id', 'size', 'color', 'quantity', 'price']
        # 'cart' 필드를 여기에 명시하지만, read_only=True로 설정하여 유효성 검사에서 제외됩니다.

    def create(self, validated_data):
        # CartItem 생성 시, user_email을 사용하여 Cart 인스턴스를 찾거나 만듭니다.
        user_email = self.context['request'].data.get('user_email')
        cart, created = Cart.objects.get_or_create(user_email=user_email)
        validated_data['cart'] = cart
        return super().create(validated_data)

