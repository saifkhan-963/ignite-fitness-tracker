import random
import string
from django.utils import timezone
from rest_framework import generics, viewsets, permissions
from rest_framework import status as http_status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User, Run, Achievement, UserAchievement, Leaderboard, Challenge, RunSession
from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    UserSerializer,
    RunSerializer,
    AchievementSerializer,
    UserAchievementSerializer,
    LeaderboardSerializer,
    ChallengeSerializer,
    RunSessionSerializer
)

# Create your views here.
class MeView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

class LoginView(generics.GenericAPIView):
    permission_classes = (AllowAny,)
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        
        # Update last login
        user.last_login = timezone.now()
        user.save()

        # Generate tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
        })
        

# User ViewSet
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return self.queryset.filter(id=self.request.user.id)


# Run ViewSet
class RunViewSet(viewsets.ModelViewSet):
    queryset = Run.objects.all()
    serializer_class = RunSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Users can only see their own runs
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# Achievement ViewSet
class AchievementViewSet(viewsets.ModelViewSet):
    queryset = Achievement.objects.all()
    serializer_class = AchievementSerializer
    permission_classes = [permissions.IsAuthenticated]


# UserAchievement ViewSet
class UserAchievementViewSet(viewsets.ModelViewSet):
    queryset = UserAchievement.objects.all()
    serializer_class = UserAchievementSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Users can only see their own achievements
        return UserAchievement.objects.filter(user=self.request.user)


# Leaderboard ViewSet
class LeaderboardViewSet(viewsets.ModelViewSet):
    queryset = Leaderboard.objects.all()
    serializer_class = LeaderboardSerializer
    permission_classes = [permissions.IsAuthenticated]


# Challenge ViewSet
class ChallengeViewSet(viewsets.ModelViewSet):
    queryset = Challenge.objects.all()
    serializer_class = ChallengeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        challenge = serializer.save()
        # challenge.participants.add(self.request.user)  # Add the creator as a participant by default
        challenge.save()


class CreateSessionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        invite_code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
        session = RunSession.objects.create(host=request.user, invite_code=invite_code)
        session.participants.add(request.user)
        serializer = RunSessionSerializer(session)
        return Response(serializer.data, status=http_status.HTTP_201_CREATED)


class JoinSessionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        invite_code = request.data.get('invite_code')
        try:
            session = RunSession.objects.get(invite_code=invite_code)
        except RunSession.DoesNotExist:
            return Response({'detail': 'Session not found.'}, status=http_status.HTTP_404_NOT_FOUND)

        if session.status != 'waiting':
            return Response({'detail': 'Session is not accepting participants'}, status=http_status.HTTP_400_BAD_REQUEST)

        session.participants.add(request.user)
        serializer = RunSessionSerializer(session)
        return Response(serializer.data)


class SessionDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            session = RunSession.objects.get(pk=pk)
        except RunSession.DoesNotExist:
            return Response({'detail': 'Session not found.'}, status=http_status.HTTP_404_NOT_FOUND)

        if request.user not in session.participants.all():
            return Response({'detail': 'Forbidden.'}, status=http_status.HTTP_403_FORBIDDEN)

        serializer = RunSessionSerializer(session)
        data = serializer.data
        data['participants_data'] = [
            {'id': u.id, 'username': u.username}
            for u in session.participants.all()
        ]
        return Response(data)


class StartSessionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            session = RunSession.objects.get(pk=pk)
        except RunSession.DoesNotExist:
            return Response({'detail': 'Session not found.'}, status=http_status.HTTP_404_NOT_FOUND)

        if request.user != session.host:
            return Response({'detail': 'Only the host can start the run.'}, status=http_status.HTTP_403_FORBIDDEN)

        if session.status != 'waiting':
            return Response({'detail': 'Session already started.'}, status=http_status.HTTP_400_BAD_REQUEST)

        session.status = 'active'
        session.started_at = timezone.now()
        session.save()

        serializer = RunSessionSerializer(session)
        return Response(serializer.data)


class EndSessionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            session = RunSession.objects.get(pk=pk)
        except RunSession.DoesNotExist:
            return Response({'detail': 'Session not found.'}, status=http_status.HTTP_404_NOT_FOUND)

        if request.user not in session.participants.all():
            return Response({'detail': 'Forbidden.'}, status=http_status.HTTP_403_FORBIDDEN)

        if session.status != 'active':
            return Response({'detail': 'Session is not active.'}, status=http_status.HTTP_400_BAD_REQUEST)

        session.status = 'completed'
        session.ended_at = timezone.now()
        session.save()

        serializer = RunSessionSerializer(session)
        return Response(serializer.data)