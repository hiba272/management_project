#api/veiws.py
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.views import APIView
from .permissions import BasePermission
from .serializers import RhSignupSerializer, EmployeSignupSerializer, EmployeSerializer  , CandidatSignupSerializer, UserSerializer,LeaveRequestSerializer,LeaveBalanceSerializer
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.permissions import AllowAny
from .permissions import IsRHUser, IsEmployeUser, IsCandidatUser
from django.contrib.auth import authenticate
from .serializers import UserSerializer 

from rest_framework import viewsets, permissions,status
from users.models import LeaveRequest,LeaveBalance,Employe
from .serializers import LeaveRequestSerializer, LeaveBalanceSerializer
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from django.utils.timezone import now


# Permissions Classes
class IsRHUser(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_rh)


class IsEmployeUser(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_employe)


class IsCandidatUser(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_candidat)


# Signup Views
class RhSignupView(generics.CreateAPIView):
    serializer_class = RhSignupSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user_data = serializer.save()
        return Response({
            'user': user_data['user'],
            'refresh': user_data['refresh'],
            'access': user_data['access'],
        }, status=status.HTTP_201_CREATED)


class EmployeSignupView(generics.CreateAPIView):
    serializer_class = EmployeSignupSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user_data = serializer.save()
        return Response({
            'user': user_data['user'],
            'refresh': user_data['refresh'],
            'access': user_data['access'],
        }, status=status.HTTP_201_CREATED)


class CandidatSignupView(generics.CreateAPIView):
    serializer_class = CandidatSignupSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user_data = serializer.save()
        return Response({
            'user': user_data['user'],
            'refresh': user_data['refresh'],
            'access': user_data['access'],
        }, status=status.HTTP_201_CREATED)


# Custom Auth Token View
# class CustomAuthToken(ObtainAuthToken):
#     def post(self, request, *args, **kwargs):
#         serializer = self.serializer_class(data=request.data, context={'request': request})
#         serializer.is_valid(raise_exception=True)
#         user = serializer.validated_data['user']
#         token, created = Token.objects.get_or_create(user=user)
#         return Response({
#             'token': token.key,
#             'user_id': user.pk,
#             'is_employe': user.is_employe,
#             'is_rh': user.is_rh,
#             'is_candidat': user.is_candidat,
#         })

from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims to the token payload
        token['is_rh'] = user.is_rh
        token['is_employe'] = user.is_employe
        token['is_candidat'] = user.is_candidat

        return token

    def validate(self, attrs):
        data = super().validate(attrs)

        # Add the user's roles to the response data
        data['user'] = {
            'is_rh': self.user.is_rh,
            'is_employe': self.user.is_employe,
            'is_candidat': self.user.is_candidat,
        }

        return data

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer



# Logout View
class LogoutView(APIView):
    def post(self, request, format=None):
        request.auth.delete()
        return Response(status=status.HTTP_200_OK)


# Role-based views
class RhOnlyView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated & IsRHUser]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class EmployeOnlyView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated & IsEmployeUser]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class CandidatOnlyView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated & IsCandidatUser]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user






class EmployeListView(APIView):
    def get(self, request):
        employes = Employe.objects.all()  # Obtenir tous les employés
        serializer = EmployeSerializer(employes, many=True)  
        return Response(serializer.data, status=status.HTTP_200_OK)



class EmployeDetail(generics.RetrieveAPIView):
    queryset = Employe.objects.all()  # Obtenir un employé par ID
    serializer_class = EmployeSerializer


class LeaveRequestViewSet(viewsets.ModelViewSet):
    queryset = LeaveRequest.objects.all()
    serializer_class = LeaveRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Limiter les résultats aux demandes de l'utilisateur connecté
        return self.queryset.filter(employee=self.request.user)

    def perform_create(self, serializer):
        employee = self.request.user
        balance = get_object_or_404(LeaveBalance, employee=employee)
        
        # Calcul des jours demandés
        start_date = serializer.validated_data['start_date']
        end_date = serializer.validated_data['end_date']
        requested_days = (end_date - start_date).days + 1
        
        # Vérification du solde de congé
        if requested_days > balance.remaining_days:
            raise serializers.ValidationError("Solde de congés insuffisant pour cette demande.")
        
        # Créer la demande de congé
        serializer.save(employee=employee)
        
        # Mettre à jour le solde de congés de l'employé
        balance.remaining_days -= requested_days
        balance.save()

class LeaveBalanceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = LeaveBalance.objects.all()
    serializer_class = LeaveBalanceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Limiter la vue pour que chaque utilisateur voie uniquement son solde
        return self.queryset.filter(employee=self.request.user)