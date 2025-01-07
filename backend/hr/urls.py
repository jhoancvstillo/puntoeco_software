from rest_framework.routers import DefaultRouter
from .views import (
    WorkerViewSet, AttendanceRecordViewSet, DocumentViewSet, 
    IncidentViewSet, EvaluationViewSet, PaymentViewSet, 
    TrainingViewSet, VacationOrPermissionViewSet
)

router = DefaultRouter()
router.register(r'workers', WorkerViewSet, basename='worker')
router.register(r'attendance', AttendanceRecordViewSet, basename='attendance')
router.register(r'documents', DocumentViewSet, basename='document')
router.register(r'incidents', IncidentViewSet, basename='incident')
router.register(r'evaluations', EvaluationViewSet, basename='evaluation')
router.register(r'payments', PaymentViewSet, basename='payment')
router.register(r'trainings', TrainingViewSet, basename='training')
router.register(r'vacations-permissions', VacationOrPermissionViewSet, basename='vacation_or_permission')

urlpatterns = router.urls
