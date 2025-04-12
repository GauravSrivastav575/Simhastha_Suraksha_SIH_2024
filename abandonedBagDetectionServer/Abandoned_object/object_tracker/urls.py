from django.urls import path
from . import views

urlpatterns = [
    path('', views.video_page, name='video_page'),
    path('video/', views.video_feed, name='video_feed'),
]
