from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from users.models import User, RH, Employe, Candidat, LeaveRequest,LeaveBalance



# Serializer de base pour l'utilisateur
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'is_rh', 'is_employe', 'is_candidat', 'profile_picture']


# Serializer pour l'inscription d'un RH
class RhSignupSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)
    profile_picture = serializers.ImageField(required=False)

    class Meta:
        model = User
        fields = ['username', 'email', 'is_rh', 'password', 'password2', 'profile_picture']
        
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def save(self, **kwargs):
        user = User(
            username=self.validated_data['username'],
            email=self.validated_data['email'],
            profile_picture=self.validated_data.get('profile_picture')  # Gestion du téléversement d'image
        )
        password = self.validated_data['password']
        password2 = self.validated_data['password2']

        if password != password2:
            raise serializers.ValidationError({"error": "passwords do not match"})

        user.set_password(password)
        user.is_rh = True
        user.save()
        RH.objects.create(user=user)

        # Générer des tokens JWT
        refresh = RefreshToken.for_user(user)

        # Retourner les détails de l'utilisateur avec le token
        return {
            'user': {
                'username': user.username,
                'email': user.email,
                'is_rh': user.is_rh,
                'profile_picture': user.profile_picture.url if user.profile_picture else None
            },
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }


# Serializer pour l'inscription d'un employé
# Serializer pour l'inscription d'un employé
class EmployeSignupSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)
    profile_picture = serializers.ImageField(required=False)
    
    # Ajout des champs spécifiques à l'employé
    tel = serializers.CharField(required=False, allow_blank=True)
    position = serializers.CharField(required=True)
    department = serializers.CharField(required=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'is_employe', 'password', 'password2', 'profile_picture', 'tel', 'position', 'department']
        
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def save(self, **kwargs):
        # Créer l'utilisateur de base
        user = User(
            username=self.validated_data['username'],
            email=self.validated_data['email'],
            profile_picture=self.validated_data.get('profile_picture')
        )
        password = self.validated_data['password']
        password2 = self.validated_data['password2']

        if password != password2:
            raise serializers.ValidationError({"error": "passwords do not match"})

        user.set_password(password)
        user.is_employe = True
        user.save()

        # Créer l'objet Employe avec les champs supplémentaires
        employe = Employe.objects.create(
            user=user,
            tel=self.validated_data.get('tel', ''),
            position=self.validated_data['position'],
            department=self.validated_data['department']
        )

        # Générer des tokens JWT
        refresh = RefreshToken.for_user(user)

        # Retourner tous les détails de l'employé avec le token
        return {
            'user': {
                'username': user.username,
                'email': user.email,
                'is_employe': user.is_employe,
                'profile_picture': user.profile_picture.url if user.profile_picture else None,
                # Inclure les champs spécifiques à l'employé
                'employe_id': employe.id,
                'department': employe.department,
                'position': employe.position,
                'tel': employe.tel,
            },
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }



# Serializer pour l'inscription d'un candidat
class CandidatSignupSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)
    profile_picture = serializers.ImageField(required=False)

    class Meta:
        model = User
        fields = ['username', 'email', 'is_candidat', 'password', 'password2', 'profile_picture']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def save(self, **kwargs):
        user = User(
            username=self.validated_data['username'],
            email=self.validated_data['email'],
            profile_picture=self.validated_data.get('profile_picture')  # Gestion du téléversement d'image
        )
        password = self.validated_data['password']
        password2 = self.validated_data['password2']

        if password != password2:
            raise serializers.ValidationError({"error": "passwords do not match"})

        user.set_password(password)
        user.is_candidat = True
        user.save()
        Candidat.objects.create(user=user)

        # Générer des tokens JWT
        refresh = RefreshToken.for_user(user)

        # Retourner les détails de l'utilisateur avec le token
        return {
            'user': {
                'username': user.username,
                'email': user.email,
                'is_candidat': user.is_candidat,
                'profile_picture': user.profile_picture.url if user.profile_picture else None
            },
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }

from rest_framework import serializers

class EmployeSerializer(serializers.ModelSerializer):
    # Inclure les informations de l'utilisateur liées à l'employé
    user = serializers.SerializerMethodField()

    class Meta:
        model = Employe
        fields = ['user', 'tel', 'position', 'department']

    def get_user(self, obj):
        return {
            'username': obj.user.username,
            'email': obj.user.email,
            'is_rh': obj.user.is_rh,
            'is_employe': obj.user.is_employe,
            'is_candidat': obj.user.is_candidat,
            'profile_picture': obj.user.profile_picture.url if obj.user.profile_picture else None,
            'date_joined': obj.user.date_joined,  # Date d'inscription de l'utilisateur
        }


# serializers.py


class LeaveRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeaveRequest
        fields = ['id', 'employee', 'start_date', 'end_date', 'reason', 'status', 'applied_on']
        read_only_fields = ['status', 'applied_on', 'employee']

class LeaveBalanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeaveBalance
        fields = ['total_days', 'remaining_days']
