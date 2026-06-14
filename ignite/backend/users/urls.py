from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    RegisterView,
    LoginView,
    UserViewSet,
    RunViewSet,
    AchievementViewSet,
    UserAchievementViewSet,
    LeaderboardViewSet,
    ChallengeViewSet
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
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('', include(router.urls)),
]