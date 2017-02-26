# RESTful API (first draft)
### Send
##### POST sock/send
<pre>
request
<code>
{
    "action": "send",
    "data": {
        "msg": ...,
        "sender": ...,
        "room_id": ...
    }
}
</code>
</pre>

<pre>
respond
<code>
{
    "status": "ok" or "error",
    "data": {
        ...
    }
    "error": "error_msg"
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
        "room_id": ...shoud be something meaningful
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
        ...
    }
    "error": "error_msg"
}
</code>
</pre>


# SOCKET 
## MongoDB 
# post question
<pre>
request
<code>
{
    "question": " ",
    "question_id": value
    "question_vote": 0
}
</code>
</pre>

# vote question
<pre>
request
<code>
{
    "question_id": value
    ...Then "question_vote": ++
}
</code>
</pre>

