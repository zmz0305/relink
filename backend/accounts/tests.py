from django.test import TestCase
from django.contrib.auth.models import User
import requests

# Create your tests here.


class AccountTest(TestCase):

    user_data = {'email': 'rli17@illinois.edu',
                     'password': '1234acd',
                     'lastname': 'Li',
                     'firstname': 'Ranran',
                     'isInstructor': 'True'}

    def setUp(self):
        print "running setup"
        self.delete_test_user()

    def register_request(self):
        response = requests.post('http://127.0.0.1:8000/accounts/register/', data=self.user_data)
        content = response.content
        print content
        return content

    def delete_test_user(self):
        post_data = {'email': self.user_data['email']}
        requests.post('http://127.0.0.1:8000/accounts/delete/', data=post_data)

    def login_failed_request(self):
        post_data = {'email': self.user_data['email'],
                     'password': '1234'}
        response = requests.post('http://127.0.0.1:8000/accounts/login/', data=post_data)
        print response.content
        return response.content

    def login_correct_request(self):
        post_data = {'email': self.user_data['email'],
                     'password': self.user_data['password']}
        response = requests.post('http://127.0.0.1:8000/accounts/login/', data=post_data)
        print response.content
        return response.content

    def logout_request(self):
        response = requests.post('http://127.0.0.1:8000/accounts/logout/')
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
        self.assertEqual(response, 'Success in login')

    def test_logout(self):
        self.register_request()
        self.login_correct_request()
        response = self.logout_request()
        self.assertEqual(response, "Hello, world. You're at the index.")

#
# users = User.objects.filter(username='rli17@illinois.edu')
# for u in users:
#     u.delete()
