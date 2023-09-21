const TelegramApi = require('node-telegram-bot-api')
const {gameOption, againOption} = require('./option')
const token = '6300769875:AAGjR0-A_MQuaw6zLYvI-H262Jpg7YsNErA'
const bot = new TelegramApi(token, {polling: true})
const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Сейчас я загадаю цифру от 0 до 9, а ты должен ее угадать!`)
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber
    await bot.sendMessage(chatId, 'Отгадай!', gameOption)
}

const start = async () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начальное привествие'},
        {command: '/info', description: 'Информация о пользователе'},
        {command: '/game', description: 'Игра угадай цифру'},
    ])
    
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
    
        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/ea5/382/ea53826d-c192-376a-b766-e5abc535f1c9/7.webp')
            return bot.sendMessage(chatId, 'Добро пожаловать в телеграм канал AVN')
        }
    
        if (text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`)
        }
        if (text === '/game') {
            return startGame(chatId)
        }

        return bot.sendMessage(chatId, 'Я тебя не понимаю')
    })

    bot.on('callback_query', async msg => {
        const data = msg.data
        const chatId = msg.message.chat.id
        if (data === '/again') {
            return startGame(chatId)
        }
        if (data === chats[chatId]) {
            await bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`, againOption)
        } else {
            await bot.sendMessage(chatId, `К сожалению ты не угадал, бот загадал цифру ${chats[chatId]}`, againOption);
        
        }
    })
}

start()