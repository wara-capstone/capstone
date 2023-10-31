from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from chat.models import Room
from chat.serializers import RoomSerializer

class RoomListCreateAPIView(generics.ListCreateAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class RoomDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    permission_classes = [IsAuthenticated]

    def perform_destroy(self, instance):
        if instance.owner != self.request.user:
            return Response({"detail": "채팅방 소유자가 아닙니다."}, status=status.HTTP_403_FORBIDDEN)
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def room_users(request, room_pk):
    try:
        room = Room.objects.get(pk=room_pk)
    except Room.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if not room.is_joined_user(request.user):
        return Response({"detail": "Unauthorized user"}, status=status.HTTP_401_UNAUTHORIZED)

    username_list = room.get_online_usernames()
    return Response({"username_list": username_list})
