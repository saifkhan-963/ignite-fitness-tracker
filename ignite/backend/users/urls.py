from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    RegisterView,
    LoginView,
    MeView,
    UserViewSet,
    RunViewSet,
    AchievementViewSet,
    UserAchievementViewSet,
    LeaderboardViewSet,
    ChallengeViewSet,
    CreateSessionView,
    JoinSessionView,
    SessionDetailView,
    StartSessionView,
    EndSessionView
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'runs', RunViewSet)
router.register(r'achievements', AchievementViewSet)
router.register(r'user-achievements', UserAchievementViewSet)
router.register(r'leaderboards', LeaderboardViewSet)
router.register(r'challenges', ChallengeViewSet)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('me/', MeView.as_view(), name='me'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('sessions/create/', CreateSessionView.as_view(), name='create-session'),
    path('sessions/join/', JoinSessionView.as_view(), name='join-session'),
    path('sessions/<int:pk>/', SessionDetailView.as_view(), name='session-detail'),
    path('sessions/<int:pk>/start/', StartSessionView.as_view(), name='start-session'),
    path('sessions/<int:pk>/end/', EndSessionView.as_view(), name='end-session'),
    path('', include(router.urls)),
]