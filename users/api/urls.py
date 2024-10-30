from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CustomTokenObtainPairView,
    RhSignupView,
    EmployeSignupView,
    CandidatSignupView,
    RhOnlyView,
    EmployeOnlyView,
    LogoutView,
    EmployeListView,
    EmployeDetail,
    LeaveRequestViewSet,
    LeaveBalanceViewSet
)

# Configurer le routeur pour les ViewSets
router = DefaultRouter()
router.register(r'leave_requests', LeaveRequestViewSet, basename='leave_requests')
router.register(r'leave_balance', LeaveBalanceViewSet, basename='leave_balance')

# Autres chemins d'URL
urlpatterns = [
    path('signup/rh/', RhSignupView.as_view(), name='signup_rh'),
    path('signup/employe/', EmployeSignupView.as_view(), name='signup_employe'),
    path('signup/candidat/', CandidatSignupView.as_view(), name='signup_candidat'),
    path('login/', CustomTokenObtainPairView.as_view(), name='auth-token'),
    path('rh/dashboard/', RhOnlyView.as_view(), name='rh-dashboard'),
    path('employe/dashboard/', EmployeOnlyView.as_view(), name='employe-dashboard'),
    path('candidat/dashboard/', EmployeOnlyView.as_view(), name='candidat-dashboard'),
    path('employes/', EmployeListView.as_view(), name='employe-list'),
    path('employes/<int:pk>/', EmployeDetail.as_view(), name='employe-detail'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('', include(router.urls)),  # Inclure le routeur pour les ViewSets
]
