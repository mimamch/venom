const venom = require("venom-bot");

venom
  .create({
    session: "mimamch", //name of session
    multidevice: true, // for version not multidevice use false.(default: true)
    chromiumArgs: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--aggressive-cache-discard",
      "--disable-cache",
      "--disable-application-cache",
      "--disable-offline-load-stale-cache",
      "--disk-cache-size=0",
    ],
  })
  .then((client) => start(client))
  .catch((erro) => {
    console.log(erro);
  });

function start(client) {
  client.onMessage((message) => {
    commandHandler(client, message);

    // if (message.body === "Hi" && message.isGroupMsg === false) {
    //   client
    //     .sendText(message.from, "Welcome Venom 🕷")
    //     .then((result) => {
    //       console.log("Result: ", result); //return object success
    //     })
    //     .catch((erro) => {
    //       console.error("Error when sending: ", erro); //return object error
    //     });
    // }
  });
}

const commandHandler = async (client, message) => {
  if (message.isGroupMsg && classGroupId !== message.from) return;
  if (message.type !== "chat" && message.type !== "image") return;

  let msg = message.type == "image" ? message.caption : message.body;

  command.forEach((cmd) => {
    if (cmd.script == msg.toLowerCase()) {
      cmd.func(client, message);
    }
  });
};

const command = [
  {
    script: "ping",
    func: async (client, message) => {
      await client
        .sendText(message.from, "PONG!!!")
        .then((res) => console.log("result : ", res));
    },
  },
];
