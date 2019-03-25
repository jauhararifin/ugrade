from django.contrib import admin
from contests.models import User, Contest, Permission, Language, Problem

admin.site.register(Contest)
admin.site.register(User)
admin.site.register(Permission)
admin.site.register(Language)
admin.site.register(Problem)
