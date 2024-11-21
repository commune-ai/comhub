
IMAGE_NAME=redteam
up:
	docker run -d -p 3000:3000 -p 8000:8000 -v ./:/app --name redteam redteam
app:
	docker exec redteam bash -c "cd /app/web/ ; npm run start"
server:
	docker exec redteam bash -c "cd /app/backend; uvicorn app.main:app --reload --host 0.0.0.0"
build:
	docker build -t $(IMAGE_NAME) .
down:
	docker stop $(IMAGE_NAME)
	docker rm $(IMAGE_NAME)
enter:
	docker exec -it $(IMAGE_NAME) /bin/bash
chmod:
	chmod +x ./scripts/*
