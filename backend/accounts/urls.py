from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^login', views.login_view, name='login'),
    url(r'^register', views.register_view, name='register'),
    url(r'^delete', views.delete_user, name='delete_user'),
    url(r'^logout', views.logout_view, name='logout'),
    url(r'^classroom(|/)/(?P<room_id>[0-9]+)', views.join_room_view, name='classroom'),
    url(r'^newroom', views.create_classroom, name='newroom'),
    url(r'^postquiz', views.post_quiz, name='postquiz'),
    url(r'^posttopic', views.post_topic, name='posttopic'),
    url(r'^message', views.send_message, name='message'),
]
