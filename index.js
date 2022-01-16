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

const command = [
  {
    script: "ping",
    func: async (client, message) => {
      try {
        await client
          .sendText(message.from, "PONG!!!")
          .then((res) => console.log("result : ", res));
      } catch (error) {
        console.log("error :", error);
      }
    },
  },
  {
    script: "#stiker",
    func: async (client, message) => {
      try {
        if (message.type !== "image") return;

        const mimetype = message.mimetype;
        const data = await client.decryptFile(message);

        const base64 = `data:${mimetype};base64,${data.toString("base64")}`;
        await client.sendImageAsSticker(message.from, base64);
      } catch (error) {
        console.log("error :", error);
      }
    },
  },
];

const commandHandler = async (client, message) => {
  if (message.isGroupMsg && classGroupId !== message.from) return;
  if (message.type !== "chat" && message.type !== "image") return;

  let originalMsg = message.type == "image" ? message.caption : message.body;
  let msg = originalMsg.toLowerCase();

  command.forEach(async (cmd) => {
    if (cmd.script === msg) {
      await cmd.func(client, message);
    }
  });
};
