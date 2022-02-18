import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { Client, Intents } from "discord.js";
const TOKEN =
  "jWRInKN6vSMUWX1-VnTM72mac0mAsEhVpY1jQ5S5gqNp6E4wv8TPzJCyyxf6Y8FlK3yU";
const CLIENT_ID = "944070299337523210";
// const commands = [
//   {
//     name: "ping",
//     description: "Replies with Pong!",
//   },
// ];

// const rest = new REST({ version: "9" }).setToken(TOKEN);

// (async () => {
//   try {
//     console.log("Started refreshing application (/) commands.");

//     await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
//       body: commands,
//     });

//     console.log("Successfully reloaded application (/) commands.");
//   } catch (error) {
//     console.error(error);
//   }
// })();

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === "ping") {
    await interaction.reply("Pong!");
  }
});

try {
  const data = await client.login(TOKEN);
  console.log(data);
} catch (err) {
  console.error(err);
}

console.log(client);
