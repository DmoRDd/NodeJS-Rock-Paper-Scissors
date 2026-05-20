const fs = require("fs");
const http = require("http");

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  switch (url.pathname) {
    case "/":
      if (req.method == "GET") {
        const name = url.searchParams.get('name');
        console.log(name);
        res.writeHead(200, { "Content-Type": "text/html" });
        fs.createReadStream("./index.html").pipe(res); 
        break;
      } else if (req.method == "POST") {
        handlePostResponse(req, res);
        break;
      }
    default:
      res.writeHead(404, { "Content-Type": "text/html" });
      fs.createReadStream("./error.html").pipe(res);
      break;
  }
});

server.listen(4001, () => {
  console.log(`Server is listening at ${server.address().port}`);
});

function handlePostResponse(req, res) {
  req.setEncoding("utf8");

  let body = "";
  req.on("data", function (chunk) {
    body += chunk;
  });

  req.on("end", function () {
    const choices = ["rock", "paper", "scissors"];
    const randomChoice = choices[Math.floor(Math.random() * 3)];

    const choice = body;

    let message;

    const tied = `Aww, we tied! I also chose ${randomChoice}.`;
    const victory = `Nooooo, you won! I chose ${randomChoice}.`;
    const defeat = `Ha! You lost. I chose ${randomChoice}.`;

    if (choice === randomChoice) {
      message = tied;
    } else if (
      (choice === "rock" && randomChoice === "paper") ||
      (choice === "paper" && randomChoice === "scissors") ||
      (choice === "scissors" && randomChoice === "rock")
    ) {
      message = defeat;
    } else {
      message = victory;
    }
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(`You selected ${choice}. ${message}`);
  });
}
