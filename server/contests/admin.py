from django.contrib import admin
from contests.models import User, Contest, Permission, Language

admin.site.register(Contest)
admin.site.register(User)
admin.site.register(Permission)
admin.site.register(Language)
