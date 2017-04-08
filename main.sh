cd frontend
npm start > frontend_log.log &
FR_PID=$!
cd ../backend
python manage.py runserver > backend_log.log &
BK_PID=$!
cd ../chat_service
npm start > chat_service_log.log &
CH_PID=$!

trap 'sh kill.sh $FR_PID $BK_PID $CH_PID' 2
echo waiting a bit
sleep infinity
