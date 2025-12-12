
# Create your views here.
from django.http import JsonResponse

def welcome(request):
    data = {
        "message": "Welcome to HealthPal API 🚀",
        "status": "success"
    }
    return JsonResponse(data)
