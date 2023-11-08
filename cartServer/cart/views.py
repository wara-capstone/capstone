from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Cart, CartItem
from .serializers import CartItemSerializer
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
        # 장바구니 담기
        try:
            serializer = CartItemSerializer(data=request.data, context={'request': request})
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            # 유효성 검사 실패
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            # 기타 예외
            return Response({"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self, request):
        # 장바구니 물품 옵션 수정
        try:
            user_email = request.data.get('user_email')
            product_id = request.data.get('product_id')
            cart = Cart.objects.get(user_email=user_email)
            cart_item = CartItem.objects.get(cart=cart, product_id=product_id)
            serializer = CartItemSerializer(cart_item, data=request.data)
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                return Response(serializer.data)
        except Cart.DoesNotExist:
            return Response({"message": "Cart not found"}, status=status.HTTP_404_NOT_FOUND)
        except CartItem.DoesNotExist:
            return Response({"message": "Cart item not found"}, status=status.HTTP_404_NOT_FOUND)
        except ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request):
        # 장바구니 물품 삭제
        try:
            user_email = request.query_params.get('user_email')
            product_id = request.query_params.get('product_id')
            cart = Cart.objects.get(user_email=user_email)
            cart_item = CartItem.objects.get(cart=cart, product_id=product_id)
            cart_item.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Cart.DoesNotExist:
            return Response({"message": "Cart not found"}, status=status.HTTP_404_NOT_FOUND)
        except CartItem.DoesNotExist:
            return Response({"message": "Cart item not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get(self, request):
        # 장바구니 조회
        try:
            user_email = request.query_params.get('user_email')
            if not user_email:
                raise ValidationError("User email is required")
            cart = Cart.objects.get(user_email=user_email)
            cart_items = CartItem.objects.filter(cart=cart)
            serializer = CartItemSerializer(cart_items, many=True)
            return Response(serializer.data)
        except Cart.DoesNotExist:
            return Response({"message": "Cart not found"}, status=status.HTTP_404_NOT_FOUND)
        except ValidationError as e:
            return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
