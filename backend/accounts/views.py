from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout

from django.core.validators import validate_email
from django.contrib.auth.models import User
from django import forms
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import redirect
from django.contrib.auth.models import Group
from django.urls import reverse

# Create your views here.
from django.http import HttpResponse,HttpResponseRedirect, HttpResponseBadRequest
from .models import VirtualClassroom
from django.urls import resolve

def index(request):
    return HttpResponse("Hello, world. You're at the index.")


@csrf_exempt
def register_view(request):
    instructor, created = Group.objects.get_or_create(name='instructor')
    student, created = Group.objects.get_or_create(name='student')
    try:
        email = request.POST['username']
    except KeyError:
        return HttpResponse('Please check your email')

    try:
        password = request.POST['password']
    except KeyError:
        return HttpResponse('Please check your password')

    try:
        first_name = request.POST['firstname']
    except KeyError:
        return HttpResponse('Please check your first name')

    try:
        last_name = request.POST['lastname']
    except KeyError:
        return HttpResponse('Please check your last name')

    isInstructor = request.POST.get('isInstructor', 'False')

    # Validate email
    try:
        validate_email(email)
    except forms.ValidationError:
        return HttpResponse("Email is not valid")
    # Check if user already exist
    try:
        User.objects.get(username=email)
    except User.DoesNotExist:
        user = User.objects.create_user(email, email, password)
        user.last_name = last_name
        user.first_name = first_name
        if(isInstructor == "True"):
            user.groups.add(instructor)
        else:
            user.groups.add(student)
        user.save()
        return HttpResponse("Create user successfully")
    else:
        return HttpResponse("User already exists")


@csrf_exempt
def login_view(request):
    email = request.POST['username']
    password = request.POST['password']
    user = authenticate(username=email, password=password)
    if user is not None:
        login(request, user)
        if user.groups.filter(name='instructor').exists():
            return HttpResponse("Teacher login")
        else:
            return HttpResponse("Student login")
    else:
        return HttpResponse("Authentication Failed")


@login_required
@csrf_exempt
def logout_view(request):
    logout(request)


@csrf_exempt
def delete_user(request):
    try:
        email = request.POST['username']
    except KeyError:
        return HttpResponse('Please check your email')
    try:
        user = User.objects.get(username=email)
    except User.DoesNotExist:
        pass
    else:
        user.delete()


@csrf_exempt
@login_required
def create_classroom(request):
    current_user = request.user
    if current_user.groups.filter(name="instructor").exists():
        room = VirtualClassroom.objects.create()
        room.instructorId = current_user.id
        room.save()
        return HttpResponse("%d" % room.id)
    else:
        return HttpResponseBadRequest()

@csrf_exempt
def classroom_view(request):
    func, args, kwargs = resolve(request.path)
    if VirtualClassroom.objects.filter(id=kwargs['room_id']).exists():
        return HttpResponse("find classroom: " + str(kwargs['room_id']))
    else:
        return HttpResponse("Classroom not found")
