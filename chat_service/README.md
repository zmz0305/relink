# RESTful API (second draft)
### Send
##### POST sock/send
<pre>
request
<code>
{
    "msg": ...,
    "user": ...,
    "room_id": ...
}
</code>
</pre>

<pre>
respond
<code>
{
    "status": "ok" or "error",
    "data": {
        ... //some detailed information
    }
}
</code>
</pre>

##### POST sock/createRoom
<pre>
request
<code>
{
    "action": "create_room",
    "data": {
        "room_id": ...shoud be something meaningful and unique
    }
}
</code>
</pre>

<pre>
respond
<code>
{
    "status": "ok or error",
    "data": {
        ... // some detailed info
    }
}
</code>
</pre>


# SOCKET


# MongoDB
#### room collection
<pre>
<code>
{
    "room_name": " ",
    "room_id": " ", //must be unique, otherwise too complicated to resolve conflicts
    //format: time+user_id, time accurate to millisecond
    "room_user": [
        {"user_id": " "},
        ...// contains all users in this room
    ]
}
</code>
</pre>

## experiental ones 
#### post question
<pre>
<code>
{
    "message_msg": " ",
    "message_id": value
    "message_vote": 0
    "room_id": value
    "user_id": value
}
</code>
</pre>

#### vote question
<pre>
<code>
{
    "message_id": value
    ... "message_vote": ++
}
</code>
</pre>

