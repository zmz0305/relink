from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^login', views.login_view, name='login'),
    url(r'^register', views.register_view, name='register'),
    url(r'^delete', views.delete_user, name='delete_user'),
    url(r'^logout', views.logout_view, name='logout'),
]
