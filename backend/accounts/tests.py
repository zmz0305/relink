from django.test import TestCase
from django.contrib.auth.models import User
import requests

# Create your tests here.
from .models import VirtualClassroom
from django.test.client import RequestFactory
from .views import *


class AccountTest(TestCase):

    user_data = {'username': 'rli17@illinois.edu',
                     'password': '1234acd',
                     'lastname': 'Li',
                     'firstname': 'Ranran',
                     'isInstructor': 'True'}
    room_data = {'room_id':9}
    def setUp(self):
        print "running setup"
        self.factory = RequestFactory()
        self.test_user = User.objects.create_user('mgao16@illinois.edu', 'mgao16@illinois.edu', '123abc')

    def register_request(self):
        request = self.factory.post('/accounts/register', data=self.user_data)
        request.session = {}
        response = register_view(request)
        content = response.content
        print content
        return content

    def delete_test_user(self):
        post_data = {'username': self.user_data['username']}
        self.factory.post('/accounts/delete/', data=post_data)

    def login_failed_request(self):
        post_data = {'username': self.user_data['username'],
                     'password': '1234'}
        request = self.factory.post('/accounts/login', data=post_data)
        request.session = {}
        response = login_view(request)
        print response.content
        return response.content

    def login_correct_request(self):
        post_data = {'username': self.user_data['username'],
                     'password': self.user_data['password']}
        request = self.factory.post('/accounts/login', data=post_data)
        request.session = self.client.session
        request.session.create()
        response = login_view(request)
        print response.content
        return response.content

    def logout_request(self):
        response = logout_view(self.factory.post('/accounts/logout'))
        print response.content
        return response.content

    def test_register_new_user(self):
        response = self.register_request()
        self.assertEqual(response, 'Create user successfully')

    def test_login_failed(self):
        self.register_request()
        response = self.login_failed_request()
        self.assertEqual(response, 'Authentication Failed')

    def test_login_success(self):
        self.register_request()
        response = self.login_correct_request()
        self.assertEqual(response, 'Teacher login')

    def test_logout(self):
        self.register_request()
        self.login_correct_request()
        self.user =  User.AnonymousUser;
        response = self.logout_request()
        self.assertEqual(response, "Hello, world. You're at the index.")

    def test_classroom(self):
        create_room_request = self.factory.post('/accounts/newroom/',data={'room_id': 9})
        create_room_request.user = self.test_user
        group = Group(name='instructor')
        group.save()
        self.test_user.groups.add(group)
        create_room_respose = create_classroom(create_room_request)
        print('test class room id', create_room_respose.content)
        request = self.factory.post('/accounts/classroom/'+str(create_room_respose.content) )
        request.user = self.test_user
        #response = join_room_view(request)
        self.assertEqual("", "find classroom: " + str(create_room_respose.content))

    def tearDown(self):
        for user in User.objects.all():
            user.delete()
        for classroom in VirtualClassroom.objects.all():
            classroom.delete()
# users = User.objects.filter(username='rli17@illinois.edu')
# for u in users:
#     u.delete()
