from django.contrib import admin

from .models import GradingGroup, Grading


class GradingInline(admin.TabularInline):
    model = Grading


@admin.register(GradingGroup)
class GradingGroupAdmin(admin.ModelAdmin):
    list_display = ('id', 'submission', 'issued_time',
                    'verdict', 'finish_time')
    list_display_links = ('id', 'submission')
    inlines = [GradingInline, ]


@admin.register(Grading)
class GradingAdmin(admin.ModelAdmin):
    list_display = ('id',
                    'issued_time',
                    'verdict',
                    'finish_time',
                    'issuer',)
    list_display_links = ('id',)
