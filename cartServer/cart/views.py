from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Cart, CartItem
from .serializers import CartSerializer, CartItemSerializer

@api_view(['POST'])
def add_to_cart(request):

    user_email = request.data.get('user_email')
    store_id = request.data.get('store_id')
    product_id = request.data.get('product_id')
    product_name = request.data.get('product_name')
    product_price = request.data.get('product_price')
    size_data= request.data.get('size')
    color_data = request.data.get('color')
    quantity = request.data.get('quantity')  # 기본값으로 1 설정




@api_view(['GET'])
def view_cart(request, user_email):
    # 특정 사용자의 장바구니를 조회하는 뷰
    cart = get_object_or_404(Cart, user_email=user_email)
    serializer = CartSerializer(cart)
    return Response(serializer.data)

@api_view(['DELETE'])
def remove_from_cart(request):
    # 장바구니에서 특정 항목을 삭제하는 뷰
    user_email = request.data.get('user_email')
    product_id = request.data.get('product_id')
    
    cart = get_object_or_404(Cart, user_email=user_email)
    cart_item = get_object_or_404(CartItem, cart=cart, product_id=product_id)
    cart_item.delete()
    
    return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['PUT'])
def update_cart_item(request):
    # 장바구니의 항목을 업데이트하는 뷰
    user_email = request.data.get('user_email')
    product_id = request.data.get('product_id')
    size_name = request.data.get('size')
    color_name = request.data.get('color')

    cart = get_object_or_404(Cart, user_email=user_email)

    serializer = CartItemSerializer
    return Response(serializer.data)