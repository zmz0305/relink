# RESTful API (first draft)
### Send
##### POST /send
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
    "status": "ok or error",
    "data": {
        ...
    }
    "error": "error_msg"
}
</code>
</pre>


# SOCKET 
