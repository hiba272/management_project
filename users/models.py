from django.db import models
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import AbstractUser
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User

# Modèle personnalisé User
class User(AbstractUser):
    email = models.EmailField(unique=True) 
    is_rh = models.BooleanField(default=False)
    is_employe = models.BooleanField(default=False)
    is_candidat = models.BooleanField(default=False)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)  

    USERNAME_FIELD = 'email'  
    REQUIRED_FIELDS = []
    
    def __str__(self):
        return self.username

# Crée automatiquement un token d'authentification lorsque l'utilisateur est créé
@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)

# Modèle RH
class RH(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="rh_profile")
    dateNaiss = models.DateField(null=True, blank=True)  # Champ pour la date de naissance

    def __str__(self):
        return f"RH: {self.user.username}"

# Modèle Employé
class Employe(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="employe_profile")
    tel = models.CharField(max_length=15, blank=True, null=True)  # Ajout de null=True pour la base de données
    position = models.CharField(max_length=100)
    department = models.CharField(max_length=100)

    def __str__(self):
        return f"Employé: {self.user.username}"

# Modèle Candidat
class Candidat(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="candidat_profile")
    tel = models.CharField(max_length=15, blank=True, null=True)  # Ajout de null=True pour la base de données

    def __str__(self):
        return f"Candidat: {self.user.username}"

class LeaveRequest(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
    ]

    employee = models.ForeignKey(User, on_delete=models.CASCADE, related_name="leave_requests")
    start_date = models.DateField()
    end_date = models.DateField()
    reason = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    applied_on = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.employee.username} - {self.start_date} to {self.end_date} ({self.status})"

class LeaveBalance(models.Model):
    employee = models.OneToOneField(User, on_delete=models.CASCADE, related_name="leave_balance")
    total_days = models.IntegerField(default=30)
    remaining_days = models.IntegerField(default=30)

    def __str__(self):
        return f"{self.employee.username} - {self.remaining_days} days remaining"
