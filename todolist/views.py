from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Task
import json

def home(request):
    tasks = Task.objects.all()
    return render(request, "index.html", {"tasks": tasks})

@csrf_exempt
def add_task(request):
    if request.method == "POST":
        if request.content_type == 'application/json':
            data = json.loads(request.body)
            title = data.get("title")
        else:
            title = request.POST.get("title")
        
        if title:
            task = Task.objects.create(title=title)
            if request.content_type == 'application/json':
                return JsonResponse({"id": task.id, "title": task.title, "completed": task.completed})
        return redirect("home")
    return redirect("home")

@csrf_exempt
def delete_task(request, task_id):
    try:
        Task.objects.get(id=task_id).delete()
        if request.content_type == 'application/json':
            return JsonResponse({"success": True})
    except Task.DoesNotExist:
        if request.content_type == 'application/json':
            return JsonResponse({"success": False}, status=404)
    return redirect("home")

@csrf_exempt
def toggle_task(request, task_id):
    try:
        task = Task.objects.get(id=task_id)
        task.completed = not task.completed
        task.save()
        if request.content_type == 'application/json':
            return JsonResponse({"id": task.id, "completed": task.completed})
    except Task.DoesNotExist:
        if request.content_type == 'application/json':
            return JsonResponse({"success": False}, status=404)
    return redirect("home")

@csrf_exempt
def clear_tasks(request):
    if request.method == "POST":
        Task.objects.all().delete()
        if request.content_type == 'application/json':
            return JsonResponse({"success": True})
    return redirect("home")

def get_tasks(request):
    tasks = Task.objects.all().values('id', 'title', 'completed')
    return JsonResponse(list(tasks), safe=False)

