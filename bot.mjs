import 'dotenv/config'
import TelegramBot from "node-telegram-bot-api"
import {
  buscarAccion
} from "./index.mjs"

const bot = new TelegramBot(process.env.token, {polling: true});

bot.onText(/\/echo (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = match[1]; 
  bot.sendMessage(chatId, resp);
});

bot.on('message', async ({ chat: { id }, text }) => {
  const fn = buscarAccion(text);
  try {
      const response = await fn(text); // Llama a la función de acción
      if (response.endsWith('.png')) {
          // Si la respuesta es una ruta de imagen, envíala
          bot.sendPhoto(id, response, { caption: 'Aquí está tu código de barras para la factura que debes:' });
      } else {
          bot.sendMessage(id, response); // De lo contrario, envía el mensaje
      }
  } catch (error) {
      bot.sendMessage(id, error.message);
  }
});

bot.on("error", console.log)

bot.on("connect", (params)=>{
  console.log(params)
})




