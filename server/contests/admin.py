from django.contrib import admin
from contests.models import User, Contest, Permission, Language, Problem, Submission


@admin.register(Contest)
class ContestAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'short_id', 'short_description',
                    'start_time', 'freezed', 'finish_time')
    list_display_links = ('id', 'name')


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'contest', 'username', 'name', 'email')
    list_display_links = ('id', 'name')


@admin.register(Permission)
class PermissionAdmin(admin.ModelAdmin):
    list_display = ('code', 'description')


admin.site.register(Language)


@admin.register(Problem)
class ProblemAdmin(admin.ModelAdmin):
    list_display = ('id', 'contest', 'short_id', 'name', 'disabled',
                    'time_limit', 'tolerance', 'memory_limit', 'output_limit')
    list_display_links = ('id', 'name')


@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    list_display = ('id', 'problem', 'solution', 'issued_time')
    list_display_links = ('id', 'problem', 'solution')
