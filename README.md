# Chat App
This is a chat app using RabbitMQ, express and ws

## Pre requirements

- Clone and Install the stock bot [instructions here](https://github.com/guitartsword/chat-stock-bot)
- Node installed
- A web socket capable browser
- Have one RabbitMQ instance create and at least one queue
- bcrypt depends on `python 2.x`, `node-gyp`. [more details here](https://github.com/kelektiv/node.bcrypt.js)
- node-gyp wich depends on python, and some specifics to OS, [more details here](https://github.com/nodejs/node-gyp)


## Installation Instructions

1. Clone this repository
2. Open the terminal inside the recently cloned repository
3. Create a .env file in the root project folder
4. `npm install`
5. `npm run dev`
6. Run the bot [install instructions and repository here](https://github.com/guitartsword/chat-stock-bot)

### Environmental Variables

These are the following variables you must configure

```sh
PORT=3030
RABBITMQ_URL=amqp://rabbitmqurl
RABBITMQ_QUEUE=queue_name
RABBITMQ_STOCKBOT_QUEUE=stock_queue_name
JWT_SECRET=suPerBIff1cUlt5EcreT123456
SALT_ROUNDS=12
```

## Usage Instructions

Open http://IP_ADDR:PORT/ and start chatting
