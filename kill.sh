echo first pid is $1
echo second pid is $2
echo third pid is $3
pkill -TERM -P $1
kill -9 $1
pkill -TERM -P $2
kill -9 $2
pkill -TERM -P $3
kill -9 $3
