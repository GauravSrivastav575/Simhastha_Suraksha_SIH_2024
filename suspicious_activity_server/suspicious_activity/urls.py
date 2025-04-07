from django.urls import path
from . import views

urlpatterns = [
    path('crime-stream/', views.crime_detection_stream, name='crime_stream'),
]
