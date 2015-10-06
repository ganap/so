from rest_framework import permissions


class IsOwnerAndAdminOrReadOnly(permissions.BasePermission):

    """
    Custom permission to only allow creators of an object to edit it.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            # we cant return private album to anyone except owner
            return True

        # Write permissions are only allowed to the owner.
        # FIXME: add admin/moderacor check. they can edit object either
        is_admin = getattr(request.user, 'is_admin', False)
        if is_admin:
            return True
        owner_pk = getattr(obj, 'owner_pk', 0)
        owner = getattr(obj, 'owner', 0)
        if owner_pk != 0:
            owner = owner_pk

        return owner == request.user.id


class IsAdminOrReadOnly(permissions.BasePermission):

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        is_admin = getattr(request.user, 'is_admin', False)
        return is_admin

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        is_admin = getattr(request.user, 'is_admin', False)
        return is_admin


class IsAdminOrModeratorOrNone(permissions.BasePermission):

    def has_permission(self, request, view):
        is_admin = getattr(request.user, 'is_admin', False)
        is_moderator = getattr(request.user, 'is_moderator', False)
        if is_admin or is_moderator:
            return True
        return False

    def has_object_permission(self, request, view, obj):
        is_admin = getattr(request.user, 'is_admin', False)
        is_moderator = getattr(request.user, 'is_moderator', False)
        if is_admin or is_moderator:
            return True
        return False
