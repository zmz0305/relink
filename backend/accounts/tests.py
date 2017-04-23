from django.test import TestCase
import pymongo
from django.test.client import RequestFactory
from .views import *


class AccountTest(TestCase):

    user_data = {'username': 'rli17@illinois.edu',
                     'password': '1234acd',
                     'lastname': 'Li',
                     'firstname': 'Ranran',
                     'isInstructor': 'True'}

    def setUp(self):
        print "running setup"
        self.factory = RequestFactory()
        self.test_user = User.objects.create_user('mgao16@illinois.edu', 'mgao16@illinois.edu', '123abc')
        group = Group(name='instructor')
        group.save()
        self.test_user.groups.add(group)

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
        request = self.factory.post('/accounts/logout')
        request.session = self.client.session
        request.session.create()
        request.user = self.test_user
        response = logout_view(request)
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
        response = self.logout_request()
        self.assertEqual(response, "user get logout")

    def test_classroom(self):
        create_room_request = self.factory.get('/accounts/newroom/')
        create_room_request.user = self.test_user

        try:
            create_room_respose = create_classroom(create_room_request)
        except pymongo.errors.DuplicateKeyError, e:
            self.assertEqual(e.message, "E11000 duplicate key error collection: test.rooms index: room_id_1 dup key: { : \"1\" }")

    def test_create_quiz(self):
        post_data = {'questions': "Q1 Q2",
                     'quizname': "test_quiz",
                     'answers': "[0,1]"}
        create_quiz_request = self.factory.post('/accounts/createquiz', data=post_data)
        create_quiz_request.user = self.test_user
        create_quiz_request.session = self.client.session
        create_quiz_request.session.create()
        response = create_quiz(create_quiz_request)
        self.assertEqual(response.content, "/Users/rrr/Code/project/relink/backend/resource/quiz/1/questions/test_quiz")

    def test_post_quiz(self):
        self.register_request()
        self.login_correct_request()
        post_data = {'instructor_id': 'mgao16@illinois.edu',
                     'quizname': "test_quiz"}
        post_quiz_request = self.factory.post('/accounts/createquiz', data=post_data)
        post_quiz_request.user = self.test_user
        post_quiz_request.session = self.client.session
        post_quiz_request.session.create()
        response = post_quiz(post_quiz_request)
        self.assertEqual(response.content, '["Q1 Q2", "[0,1]"]')

    def test_list_quiz(self):
        request = self.factory.get('/accounts/listquiz/')
        request.user = self.test_user
        request.session = self.client.session
        request.session.create()
        response = list_all_quiz(request)
        self.assertEqual(response.content, '["test_quiz", "testname"]')

    def tearDown(self):
        for user in User.objects.all():
            user.delete()
        for classroom in VirtualClassroom.objects.all():
            classroom.delete()
