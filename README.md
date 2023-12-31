# 361-weather-index


## 361 Communication Contract

### Overview
This microservice provides an interface to fetch and serve trivia questions based on different categories and difficulty levels. It uses the Trivia API to generate a pool of trivia questions, and serves these questions to clients over a ZeroMQ socket.

### Features
- Fetch trivia questions from the Trivia API.
- Support multiple categories and difficulty levels.
- Dynamically refresh questions in the pool based on demand.

### Usage
1. Start the microservice
2. The service listens on a ZeroMQ socket at `tcp://*:5555`.
3. The client requests should be in a JSON format and sent using UTF-8 encoding with the following keys: `"request"`, `"difficulty"`, and `"category"`.
4. The service will respond with a trivia question in JSON format.

#### Request Format
- `{"request": "getQuestion", "difficulty": "easy", "category": "music"}`

#### Response Format
- JSON object representing a trivia question

#### UML Sequence Diagram
![uml sequence diagram](https://cdn.discordapp.com/attachments/1057974302739280002/1174835993908625461/fb2c95ce63.png?ex=65690a48&is=65569548&hm=2f5dec36e3fe1aab2853fb065efd2c2b274a930bf8452bcdca7894117670c266&)