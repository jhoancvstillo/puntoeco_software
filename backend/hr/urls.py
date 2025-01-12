from rest_framework.routers import DefaultRouter
from .views import (
    WorkerViewSet, AttendanceRecordViewSet, DocumentViewSet, 
    IncidentViewSet, EvaluationViewSet, PaymentViewSet, 
    TrainingViewSet, VacationOrPermissionViewSet
)
from django.urls import path, include
from django.http import JsonResponse

def hr_root_view(request):
    return JsonResponse({
        "message": "Welcome to the HR API. Use specific endpoints to access data."
    })

router = DefaultRouter()
router.register(r'workers', WorkerViewSet, basename='worker')
router.register(r'attendance', AttendanceRecordViewSet, basename='attendance')
router.register(r'documents', DocumentViewSet, basename='document')
router.register(r'incidents', IncidentViewSet, basename='incident')
router.register(r'evaluations', EvaluationViewSet, basename='evaluation')
router.register(r'payments', PaymentViewSet, basename='payment')
router.register(r'trainings', TrainingViewSet, basename='training')
router.register(r'vacations-permissions', VacationOrPermissionViewSet, basename='vacation_or_permission')

urlpatterns = [
    path('', hr_root_view, name='hr-root'),
    path('', include(router.urls)),
]
