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
from django.http import HttpResponse, HttpResponseServerError
from .models import VirtualClassroom
from django.urls import resolve
from pymongo import MongoClient
import pprint
import requests
import os


from Relink.settings import BASE_DIR

client = MongoClient('localhost', 27017)
db = client['test-database']
rooms_collection = db['rooms']
users_collection = db['users']
current_quiz_id = 0
quiz_dir = os.path.join(BASE_DIR, 'resource', 'quiz')
chat_service_url = "http://localhost:3000/"


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
        insert_user_to_mongo(user)
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


#@login_required
@csrf_exempt
def logout_view(request):
    logout(request)
    return HttpResponse("user get logout")


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


def insert_user_to_mongo(user):
    result = {"user_id": user.id,
              "email": user.username}
    insert_id = db.users.insert_one(result).inserted_id
    print insert_id


def insert_room_to_mongo(room):
    result = {"room_name": room.name,
              "room_id": room.id,
              "room_user": []}
    insert_id = db.rooms.insert_one(result).inserted_id
    print(insert_id)



@csrf_exempt
@login_required
def create_classroom(request):
    current_user = request.user
    if current_user.groups.filter(name="instructor").exists():
        room = VirtualClassroom.objects.create()
        room.instructorId = current_user.id
        room.save()
        insert_room_to_mongo(room)
        return HttpResponse("%d" % room.id)

    else:
        return HttpResponseServerError()


@csrf_exempt
@login_required
def join_room_view(request, room_id):
    mongo_user = db.users.find_one({"user_id": request.user.id})
    pprint.pprint(db.users.find_one({"user_id": request.user.id}))
    if VirtualClassroom.objects.filter(id=int(room_id)).exists():
        room = db.rooms.find_one({"room_id": int(room_id)})
        if room is not None:
            old_users = room['room_user']
            if mongo_user not in old_users:
                old_users.append(mongo_user)
                room['room_user'] = old_users
                db.rooms.save(room)
                pprint.pprint(db.rooms.find_one({"room_id": int(room_id)}))
        if request.user.groups.filter(name="instructor").exists():
            return HttpResponse("Instructor, find classroom: " + str(room_id))
        else:
            return HttpResponse("Student, find classroom: " + str(room_id))
    else:
        return HttpResponseServerError()



@csrf_exempt
@login_required
def send_message(request):
    try:
        roomid = request.POST['room_id']
    except KeyError:
        return HttpResponse('Please check roomid')
    try:
        msg = request.POST['message']
    except KeyError:
        return HttpResponse('Please check message')
    data = {"message": str(msg), "user": str(request.user.id), "room_id": str(roomid)}
    url = chat_service_url+"sock/send"
    response = requests.post(url, data=data)
    if response.status_code == 200:
        return HttpResponse("Message sent")
    else:
        return HttpResponseServerError("Message send failed")


@csrf_exempt
@login_required
def create_quiz(request):
    global current_quiz_id
    current_user = request.user
    if current_user.groups.filter(name="instructor").exists():
        try:
            quiz_file_name= os.path.join(quiz_dir, str(current_quiz_id))
            current_quiz_id += 1
            quiz_content = request.POST['quiz']
            with open(quiz_file_name, 'w') as quiz_file:
                quiz_file.write(quiz_content)
            return HttpResponse(quiz_file_name)
        except KeyError:
            return HttpResponse("Please check if quiz field exists", status=500)
    else:
        return HttpResponseServerError()


@csrf_exempt
@login_required
def post_quiz(request):
    current_user = request.user
    if current_user.groups.filter(name="instructor").exists():
        try:
            quiz_file_name = request.POST['quizid']
            try:
                with open(quiz_file_name, 'r') as quiz_file:
                    return HttpResponse(quiz_file.read())
            except IOError:
                return HttpResponse("Please check the quizid is valid", status=500)
        except KeyError:
            return HttpResponse("Please check if quizid field exists", status=500)
    else:
        return HttpResponseServerError()


@csrf_exempt
@login_required
def post_topic(request):
    current_user = request.user
    if current_user.groups.filter(name="instructor").exists():
        print "instructor can post topic"
        #TODO: call chat service api
    else:
        return HttpResponseServerError()

