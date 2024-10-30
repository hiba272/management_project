#api/permissions.py
from rest_framework.permissions import BasePermission


class IsRHUser(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_rh)

class IsEmployeUser(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_employe)

class IsCandidatUser(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_candidat)
