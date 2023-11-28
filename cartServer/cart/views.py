from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Cart, CartItem, Product
from .serializers import CartItemSerializer, ProductSerializer
from django.core.exceptions import ValidationError
from py_eureka_client import eureka_client
from django.http import JsonResponse
from django.conf import settings
# 서비스의 상태를 확인하기 위한 'health' 뷰 함수입니다.
def health(request):
    # HTTP 응답으로 JSON 형식의 {"status": "UP"}을 반환합니다.
    # 이는 서비스가 정상 작동 중임을 나타냅니다.
    return JsonResponse({"status": "UP"})

# 서비스를 Eureka 서버에 등록하는 함수입니다.
def register_service():
    # Django 설정에서 Eureka 서비스의 포트 번호를 가져와 정수로 변환합니다.
    instance_port = int(settings.EUREKA_SERVICE['instance']['port']['$'])
    # eureka_client를 초기화하여 Eureka 서버에 현재 인스턴스를 등록합니다.
    # 여기서 Eureka 서버의 URL, 애플리케이션 이름, 인스턴스 포트를 설정합니다.
    eureka_client.init(eureka_server=settings.EUREKA_SERVER_URL,
                    app_name=settings.EUREKA_SERVICE['instance']['app'],
                    instance_port=instance_port,
                    instance_host=settings.EUREKA_SERVICE['instance']['ipAddr'])
    

# Eureka 서버에서 현재 서비스의 등록을 해제하는 함수입니다.
def deregister_service_from_eureka():
    # eureka_client의 stop 메서드를 호출하여 현재 애플리케이션 인스턴스의 등록을 해제합니다.
    eureka_client.stop()


class CartItemAPIView(APIView):
    def post(self, request):
        try:
            user_email = request.data.get('user_email')
            cart, created = Cart.objects.get_or_create(user_email=user_email)

            product_data = request.data.get('product')
            product_serializer = ProductSerializer(data=product_data)
            product_serializer.is_valid(raise_exception=True)
            product = product_serializer.save()

            serialized_product = ProductSerializer(product).data
            cart_item_data = {
                'cart': cart.id,
                'product': serialized_product,
                'store_id': request.data.get('store_id'),
            }

            cart_item_serializer = CartItemSerializer(data=cart_item_data)
            cart_item_serializer.is_valid(raise_exception=True)
            cart_item = cart_item_serializer.save()
            return Response(cart_item_serializer.data, status=status.HTTP_201_CREATED)
        except ValidationError as ve:  # 입력 데이터 검증 오류
            return Response({'error': str(ve)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:  # 그 외 서버 내부 오류
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self, request):
        try:
            user_email = request.data.get('user_email')
            cart_item_id = request.data.get('cart_item_id')
            
            cart = get_object_or_404(Cart, user_email=user_email)
            cart_item = get_object_or_404(CartItem, id=cart_item_id, cart=cart)

            product_serializer = ProductSerializer(cart_item.product, data=request.data.get('product'))
            product_serializer.is_valid(raise_exception=True)
            product_serializer.save()

            cart_item_serializer = CartItemSerializer(cart_item, data=request.data)
            cart_item_serializer.is_valid(raise_exception=True)
            cart_item_serializer.save()
            return Response(cart_item_serializer.data, status=status.HTTP_200_OK)
        except ValidationError as ve:  # 입력 데이터 검증 오류
            return Response({'error': str(ve)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:  # 그 외 서버 내부 오류
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request):
        try:
            user_email = request.query_params.get('user_email')
            cart_item_ids = request.query_params.getlist('cart_item_id')  # 여러 cart_item_id 받기

            cart = get_object_or_404(Cart, user_email=user_email)

            for cart_item_id in cart_item_ids:
                cart_item = get_object_or_404(CartItem, id=cart_item_id, cart=cart)
                cart_item.delete()

            return Response(status=status.HTTP_204_NO_CONTENT)
        except ValidationError as ve:  # 입력 데이터 검증 오류
            return Response({'error': str(ve)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:  # 그 외 서버 내부 오류
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get(self, request):
        try:
            user_email = request.query_params.get('user_email')
            cart = get_object_or_404(Cart, user_email=user_email)
            cart_items = CartItem.objects.filter(cart=cart).select_related('product')
            
            cart_item_serializer = CartItemSerializer(cart_items, many=True)
            return Response(cart_item_serializer.data, status=status.HTTP_200_OK)
        except ValidationError as ve:  # 입력 데이터 검증 오류
            return Response({'error': str(ve)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:  # 그 외 서버 내부 오류
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
