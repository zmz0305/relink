# Relink_backend


accounts/index

home page


accounts/register

POST: {

        username = "username"
        
        password = "password"
        
        lastname = "lastname"
        
        firstname = "firstname"
        
        isInstructor = "True" or "False" //default is False
        
}



accounts/login

POST: {

   username = "username"
   
   passwrod = "password"
   
}

will return "Teacher login" or "Student login"



accounts/logout

POST: {}

will redirect to accounts/index



accounts/delete_user

POST: {

        email = 'email'

}

