#

# if commune does not exist build it

# if docker is not running, start it

NAME=redteam
PWD=~/$NAME
CONTAINER_NAME=$NAME
SHM_SIZE=4g
BACKEND_PORT=8000
FRONTEND_PORT=3000

CONTAINER_EXISTS=$(docker ps -q -f name=$CONTAINER_NAME)  
if [ $CONTAINER_EXISTS ]; then
  echo "STOPPING CONTAINER $CONTAINER_NAME"
  docker kill $CONTAINER_NAME
  CONTAINER_ID=$(docker ps -aq -f name=$CONTAINER_NAME)
  docker rm $CONTAINER_NAME
fi

CMD_STR="docker run -d \
  --name $CONTAINER_NAME \
  --shm-size $SHM_SIZE \
  -v ~/.$NAME:/root/.$NAME \
  -v $PWD:/app \
  -p $BACKEND_PORT:$BACKEND_PORT \
  -p $FRONTEND_PORT:$FRONTEND_PORT \
  --restart unless-stopped \
  --privileged
  $CONTAINER_NAME
"

eval $CMD_STR


