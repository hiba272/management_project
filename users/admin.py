from django.contrib import admin
from .models import User, RH, Employe, Candidat, LeaveRequest, LeaveBalance

# Enregistrer les modèles dans l'interface d'administration de base
admin.site.register(User)
admin.site.register(RH)
admin.site.register(Employe)
admin.site.register(Candidat)
admin.site.register(LeaveRequest)
admin.site.register(LeaveBalance)