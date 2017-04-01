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
import pickle
import json

from django.utils.html import escape

from Relink.settings import BASE_DIR

client = MongoClient('localhost', 27017)
db = client['test']
rooms_collection = db['rooms']
quiz_dir = os.path.join(BASE_DIR, 'resource', 'quiz')
chat_service_url = "http://localhost:3000/"


def index(request):
    # return HttpResponse('Login requred!');
    return HttpResponse('session from index: ' + escape((request.session.keys())))

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


def insert_room_to_mongo(room):
    result = {"room_name": room.name,
              "room_id": str(room.id),
              "room_user": []}
    insert_id = db.rooms.insert_one(result).inserted_id
    print(insert_id)



@csrf_exempt
@login_required
def create_classroom(request):
    # return HttpResponse('session from index: ' + escape((request.session.keys())))
    print(request)
    current_user = request.user
    if current_user.groups.filter(name="instructor").exists():
        room = VirtualClassroom.objects.create()
        room.instructorId = current_user.id
        room.save()
        insert_room_to_mongo(room)
        return HttpResponse("%s" % str(room.id))

    else:
        return HttpResponseServerError()


@csrf_exempt
@login_required
def join_room_view(request, room_id):
    mongo_user_id = str(request.user.id)
    mongo_user = {"user_id": mongo_user_id}
    if VirtualClassroom.objects.filter(id=int(room_id)).exists():
        room = db.rooms.find_one({"room_id": str(room_id)})
        if room is not None:
            old_users = room['room_user']
            old_user_ids = [old_user['user_id'] for old_user in old_users]
            if mongo_user_id not in old_user_ids:
                old_users.append(mongo_user)
                room['room_user'] = old_users
                db.rooms.save(room)
                pprint.pprint(db.rooms.find_one({"room_id": str(room_id)}))
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


def ensure_dir(file_path):
    if not os.path.exists(file_path):
        os.makedirs(file_path)



@csrf_exempt
@login_required
def create_quiz(request):
    current_user = request.user
    if current_user.groups.filter(name="instructor").exists():
        user_folder = os.path.join(quiz_dir, str(current_user.id))
        ensure_dir(user_folder)
        try:
            quiz_name = request.POST['quizname']
            quiz_file_name = os.path.join(quiz_dir, str(current_user.id), quiz_name)
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
def send_quiz(request):
    current_user = request.user
    if current_user.groups.filter(name="instructor").exists():
        quiz_file_name = request.POST['quizname']
        roomid = request.POST['room_id']
        data = {"quiz_name": quiz_file_name, "user": str(request.user.id), "room_id": str(roomid)}
        url = chat_service_url + "sock/sendQuiz"
        print data, url
        response = requests.post(url, data=data)
        if response.status_code == 200:
            return HttpResponse("Quiz sent")
        else:
            return HttpResponseServerError("Quiz send failed")
    else:
         return HttpResponseServerError("Quiz send failed, not instructor")


@csrf_exempt
@login_required
def post_quiz(request):
    #current_user = request.user
    instuctorid = request.POST["instructor_id"]
    try:
        quiz_file_name = request.POST['quizname']
        quiz_file_path = os.path.join(quiz_dir, str(instuctorid), quiz_file_name)
        try:
            with open(quiz_file_path, 'r') as quiz_file:
                return HttpResponse(quiz_file.read())
        except IOError:
            return HttpResponse("Please check the quizid is valid", status=500)
    except KeyError:
        return HttpResponse("Please check if quizid field exists", status=500)


@csrf_exempt
@login_required
def list_all_quiz(request):
    current_user = request.user
    result = []
    if current_user.groups.filter(name="instructor").exists():
        quiz_file_path = os.path.join(quiz_dir, str(current_user.id))
        if os.path.exists(quiz_file_path):
            for quiz in os.listdir(quiz_file_path):
                result.append(quiz)
    return HttpResponse(json.dumps(result))

@csrf_exempt
@login_required
def post_topic(request):
    current_user = request.user
    if current_user.groups.filter(name="instructor").exists():
        print "instructor can post topic"
        #TODO: call chat service api
    else:
        return HttpResponseServerError()
