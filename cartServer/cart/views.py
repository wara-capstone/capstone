from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Cart, CartItem
from .serializers import CartItemSerializer
from django.core.exceptions import ValidationError
from django.db import IntegrityError, DatabaseError

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
