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
    """
    Index page of back end
    :param request:
    :return:
    """
    return HttpResponse('session from index: ' + escape((request.session.keys())))

@csrf_exempt
def register_view(request):
    """
    End point for register
    :param request: HTTP request
    :return: HTTP response
    """
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
    """
    End point for logging in users
    :param request: HTTP request
    :return: HTTP response
    """
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


@csrf_exempt
def logout_view(request):
    """
    End Point for logging user out
    :param request: HTTP request
    :return: HTTP response
    """
    mongo_user_id = str(request.user.username)
    # logout the user (from chat service and website)
    mongo_user = {"user_id": mongo_user_id}
    for room in db.rooms.find():
        users = room['room_user']
        if mongo_user in users:
            users.remove(mongo_user)
            db.rooms.save(room)
    logout(request)
    return HttpResponse("user get logout")


@csrf_exempt
def delete_user(request):
    """
    End Point for deleting user
    :param request: HTTP request
    :return: HTTP response
    """
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


def insert_room_to_mongo(room, instructor_id):
    """
    Register user to chat service
    :param room: chat room id
    :param instructor_id: id of instructor
    :return: None
    """
    result = {"room_name": room.name,
              "room_id": str(room.id),
              "room_user": [{"user_id": str(instructor_id)}]}
    insert_id = db.rooms.insert_one(result).inserted_id
    print(insert_id)



@csrf_exempt
@login_required
def create_classroom(request):
    """
    End point for creating a new virtual classroom
    :param request: HTTP request
    :return: ID of the classroom
    """
    current_user = request.user
    if current_user.groups.filter(name="instructor").exists():
        room = VirtualClassroom.objects.create()
        room.instructorId = current_user.id
        room.save()
        insert_room_to_mongo(room, current_user.username)
        return HttpResponse("%s" % str(room.id))

    else:
        return HttpResponseServerError()


@csrf_exempt
@login_required
def join_room_view(request, room_id):
    """
    End point for joining to a classroom
    :param request: HTTP request
    :param room_id: id of classroom to join
    :return: HTTP response
    """
    mongo_user_id = str(request.user.username)
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
    """
    End point for sending message to chat service
    :param request: HTTP request
    :return: HTTP response
    """
    try:
        roomid = request.POST['room_id']
    except KeyError:
        return HttpResponse('Missing room_id in request')
    try:
        msg = request.POST['message']
    except KeyError:
        return HttpResponse('Missing message in request')
    try:
        anon = request.POST['anonymous']
    except KeyError:
        return HttpResponse('Missing anonymous information in request')
    data = {"message": str(msg), "user": str(request.user.username), "room_id": str(roomid), "anonymous": anon}
    url = chat_service_url+"sock/send"
    print(url)
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
    """
    End point for storing quiz
    :param request: HTTP request
    :return: HTTP response
    """
    print(request.POST)
    print(type(request.POST.lists()[0][0]))
    current_user = request.user
    if current_user.groups.filter(name="instructor").exists():
        user_folder = os.path.join(quiz_dir, str(current_user.id))
        ensure_dir(user_folder)
        quizfolder = os.path.join(user_folder, "questions")
        answerfolder = os.path.join(user_folder, "answers")
        ensure_dir(quizfolder)
        ensure_dir(answerfolder)
        try:
            question = request.POST[unicode('questions')]
            quiz_name = request.POST[unicode('quizname')]
            quiz_file_name = os.path.join(quizfolder, quiz_name)
            with open(quiz_file_name, 'w') as quiz_file:
                quiz_file.write(question)

            answers = request.POST[unicode('answers')]
            answers_file_name = os.path.join(answerfolder, quiz_name)
            with open(answers_file_name, 'w') as answer_file:
                answer_file.write(answers)

            return HttpResponse(quiz_file_name)
        except KeyError:
            return HttpResponse("Please check if quiz field exists", status=500)
    else:
        return HttpResponseServerError()



@csrf_exempt
@login_required
def send_quiz(request):
    """
    End point for sending quiz to chat service
    :param request: HTTP request
    :return: HTTP response
    """
    current_user = request.user
    if current_user.groups.filter(name="instructor").exists():
        quiz_file_name = request.POST['quizname']
        roomid = request.POST['room_id']
        data = {"quiz_name": quiz_file_name, "user": str(request.user.username), "room_id": str(roomid)}
        url = chat_service_url + "sock/sendQuiz"
        print data, url
        response = requests.post(url, data=data)
        if response.status_code == 200:
            return HttpResponse("Quiz sent")
        else:
            return HttpResponseServerError("Quiz send failed" + response.content)
    else:
         return HttpResponseServerError("Quiz send failed, not instructor")


@csrf_exempt
@login_required
def post_quiz(request):
    """
    End point for posting quiz to front end
    :param request: HTTP request
    :return: HTTP response
    """
    print(request.user.username)
    instuctorid = request.POST["instructor_id"]
    user = User.objects.get(username=instuctorid)
    try:
        quiz_file_name = request.POST['quizname']
        quiz_file_path = os.path.join(quiz_dir, str(user.id), 'questions', quiz_file_name)
        quiz_answer_path = os.path.join(quiz_dir, str(user.id), 'answers', quiz_file_name)
        try:
            with open(quiz_file_path, 'r') as quiz_file:
                quiz_content = quiz_file.read()
            with open(quiz_answer_path, 'r') as answer_file:
                answer_content = answer_file.read()
            return HttpResponse(json.dumps([quiz_content, answer_content]))
        except IOError:
            return HttpResponse("Please check the quizid and instructor id is valid", status=500)
    except KeyError:
        return HttpResponse("Please check if quizid and instructor field exists", status=500)


@csrf_exempt
@login_required
def list_all_quiz(request):
    """
    End point for listing all the quiz an instructor has
    :param request: HTTP request
    :return: HTTP response
    """
    current_user = request.user
    result = []
    if current_user.groups.filter(name="instructor").exists():
        quiz_file_path = os.path.join(quiz_dir, str(current_user.id), 'questions')
        if os.path.exists(quiz_file_path):
            for quiz in os.listdir(quiz_file_path):
                result.append(quiz)
    return HttpResponse(json.dumps(result))

