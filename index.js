const venom = require("venom-bot");

venom
  .create({
    session: "nusantara", //name of session
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
    notif(client, message);

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
  {
    script: "#absen",
    func: async (client, message, originalMsg) => {
      let msg = originalMsg.split(" ");
      msg.shift();
      try {
        await client.sendText(
          message.from,
          `${msg.join(" ").toString()} berhasil absen`
        );
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
  let perintah = msg.split(" ")[0];
  command.forEach(async (cmd) => {
    if (cmd.script === perintah) {
      await cmd.func(client, message, originalMsg);
    }
  });
};

const notif = async (client, message) => {
  const time = new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" });
  let date =
    time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate();
  let times =
    time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
  let dateTime = date + " " + times;
  const payload = {
    message: message.type == "image" ? message.caption : message.body,
    sender: message.from,
    senderName: message.notifyName,
    pushName: message.sender.name,
    time: dateTime,
  };
  await client
    .sendText("6285838707828@c.us", JSON.stringify(payload, null, "\t"))
    .then((res) => console.log("result : ", res))
    .catch((err) => console.log(err));
};
