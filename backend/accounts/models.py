from __future__ import unicode_literals

from django.db import models

# Create your models here.
from django.db import models
from django.utils.encoding import python_2_unicode_compatible
#from django.contrib.postgres.fields import ArrayField

@python_2_unicode_compatible  # only if you need to support Python 2
class VirtualClassroom(models.Model):
    # there's an id filed added automatically
    date = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length=200)
    instructorId = models.IntegerField(default=0)
    #students = ArrayField(models.IntegerField())

    def __str__(self):
        return self.name + ' ' + self.instructorId