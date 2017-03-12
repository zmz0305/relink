# Relink_backend

Home Page

accounts/index

GET

NO Parameters required



Register

accounts/register

POST: {

        username = "username"
        
        password = "password"
        
        lastname = "lastname"
        
        firstname = "firstname"
        
        isInstructor = "True" or "False" //default is False
        
}


Login

accounts/login

POST: {

   username = "username"
   
   passwrod = "password"
   
}

Code: 200

Content: "Teacher login" or "Student login"


Log Out

accounts/logout

POST: {}

will redirect to accounts/index



accounts/delete_user

POST: {

        email = 'email'

}



### Join Room

accounts/classroom/id

GET request

#### Success:

Code:  200

Content: "find classroom: " + id

#### Fail:

Code: 500

Content: ""



### Create Room

accounts/newroom

POST request to create new room

POST: {}

#### Success:

Code:  200

Content: "id"

#### Fail:

Code: 500

Content: ""

If the user is not logged in
Will be redirect to login page


### Send Message

accounts/message

POST request to send a message to backend for authentication and forwarding to chat service

```
{
        "msg": ...,
        "room_id": ...,
}

```
Response
```
{
    "status": "200 ok" or "500 error",
    "data": {
        ... //some detailed information
    }
}
```

### Create Quiz
