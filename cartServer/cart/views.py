from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Cart, CartItem, Product, Size, Color, Store
from .serializers import CartSerializer, CartItemSerializer

@api_view(['POST'])
def add_to_cart(request):
    # 요청으로부터 데이터 추출
    user_email = request.data.get('user_email')
    store_id = request.data.get('store_id')
    product_id = request.data.get('product_id')
    product_name = request.data.get('product_name')
    product_price = request.data.get('product_price')
    size= request.data.get('size')
    color = request.data.get('color')
    quantity = request.data.get('quantity')  # 기본값으로 1 설정


    store, created= Store.objects.get_or_create(store_id=store_id)
    product, created = Product.objects.get_or_creat(product_id=product_id, name=product_name, price=product_price, size=size, color=color)

    # cart 인스턴스 가져오기, 없으면 생성
    cart, created = Cart.objects.get_or_create(user_email=user_email, store=store)

    # cart_item 인스턴스 검색, 없으면 생성
    cart_item, created = CartItem.objects.get_or_create(
        cart=cart, 
        product=product,
        quantity=quantity,
    )
    
    if created:
        # 이미 존재하면 수량 업데이트
        cart_item.quantity += 1
        cart_item.save()

    # cart_item 인스턴스에 대한 데이터를 시리얼라이즈하여 반환
    serializer = CartItemSerializer(cart_item)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


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
    product = get_object_or_404(Product, product_id=product_id)
    size = get_object_or_404(Size, size=size_name)
    color = get_object_or_404(Color, color=color_name)

    if size not in product.size.all() or color not in product.color.all():
        return Response({'error': 'Size or color is invalid for the product.'}, status=status.HTTP_400_BAD_REQUEST)

    cart_item = get_object_or_404(CartItem, cart=cart, product=product)
    cart_item.size = size
    cart_item.color = color
    cart_item.save()

    serializer = CartItemSerializer
    return Response(serializer.data)