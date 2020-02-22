# Chat App
This is a chat app using RabbitMQ, express and ws

## Pre requirements

- Node installed
- A web socket capable browser
- Have one RabbitMQ instance create and at least one queue

## Installation Instructions

1. Clone this repository
2. Open the terminal inside the recently cloned repository
3. Create a .env file in the root project folder
4. `npm install`
5. `npm run dev`

### Environmental Variables

These are the following variables you must configure

```sh
PORT=3030
RABBITMQ_URL=amqp://rabbitmqurl
RABBITMQ_QUEUE=queue_name
```

## Usage Instructions

Open http://IP_ADDR:PORT/ and start chatting
