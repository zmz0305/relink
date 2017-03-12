# RESTful API (second draft)
### Send message 
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
response
<code>
{
    "status": "200 ok" or "500 error",
    "data": {
        ... //some detailed information
    }
}
</code>
</pre>

### Chatroom related
##### GET sock/room
```
response

{
	"status" : "jjblowd",
	"data" : [all the rooms] 
}
```
##### POST sock/createRoom
<pre>
request
<code>
{
    "room_id": ...shoud be something meaningful and unique
    "room_name": name, "" by default
}
</code>
</pre>

<pre>
response
<code>
{
    "status": "200 ok or 500 error",
    "data": {
        ... // some detailed info
    }
}
</code>
</pre>


# SOCKET
#### Join room

```
frontend sends
emit('join', {room_id: 'some_id', user: 'username'});
```
```
server response

emit("error", {data: 'room_id does not exist'});

or

emit("ok", {data: 'joined room_id'});
```

#### receive message
```
backend sends
('message', {room_id})
```

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

