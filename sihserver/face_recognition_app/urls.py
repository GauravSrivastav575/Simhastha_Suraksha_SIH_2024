from django.urls import path
from .views import add_face
from .views import detect_known_persons, get_missing_person_request,getCheck
getCheck

urlpatterns = [
    path('add-face/', add_face, name='add_face'),  # Endpoint to add face
    # path('add-cam/', add_cam, name='add_cam'),  # Endpoint to add face
    # path('sih/', sih, name='sih'),  # Endpoint to add face
    path('detect/', detect_known_persons, name='detect_known_persons'),  # Endpoint to add face
    path('database/', get_missing_person_request, name='get_missing_person_request'),  # Endpoint to add face
    path('check/', getCheck, name='getCheck'),  # Endpoint to add face
]


