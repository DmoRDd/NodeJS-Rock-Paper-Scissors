const fs = require("fs");
const http = require("http");

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  //css request
  if (url.pathname.startsWith("/views/styles/")) {
    res.writeHead(200, { "Content-Type": "text/css" });
    fs.createReadStream("." + url.pathname).pipe(res);
    return;
  }
  //image request
  if (url.pathname.startsWith("/images/")) {
    res.writeHead(200, {"Content-Type": "image/png"});
    fs.createReadStream("." + url.pathname).pipe(res);
    return;
  }
  switch (url.pathname) {
    case "/":
      if (req.method == "GET") {
        const name = url.searchParams.get('name'); //getting name from url query
        console.log(name);
        
        res.writeHead(200, { "Content-Type": "text/html" });
        fs.createReadStream("./views/index.html").pipe(res); 
        
        break;
      } else if (req.method == "POST") {
        coreLoop(req, res);
        break;
      }
    
    default:
      
      res.writeHead(404, { "Content-Type": "text/html" });
      fs.createReadStream("./views/error.html").pipe(res);
      
      break;
  }
});

server.listen(3000, () => {
  console.log(`Server is listening at ${server.address().port}`);
});


//I could have written this inside the switch case as well :))
function coreLoop(req, res) {
  req.setEncoding("utf8");

  let body = "";
  req.on("data", chunk => {
    body += chunk;
  });

  req.on("end", () => {
    const choices = ["taş", "kağıt", "makas"];
    const randomChoice = choices[Math.floor(Math.random() * 3)];

    const choice = body;

    let message;

    const tied = `Ne şans ama! Benim seçimim de  ${randomChoice}tan yana oldu :).`;
    const victory = `Ah, hayır! Sen kazandın. Ben ${randomChoice} demiştim.`;
    const defeat = `Hahahaaa, kaybettin! Seçimim: ${randomChoice.charAt(0).toUpperCase() + randomChoice.slice(1)}.`;

    if (choice === randomChoice) {
      
      message = tied;

    } else if ((choice === "taş" && randomChoice === "kağıt") || (choice === "kağıt" && randomChoice === "makas") || (choice === "makas" && randomChoice === "taş")) {
      
      message = defeat;
    
    } else {
      
      message = victory;

    }

    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(`${choice.charAt(0).toUpperCase() + choice.slice(1)} seçimini yaptın. ${message}`);
  });
}
