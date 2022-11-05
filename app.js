const { Telegraf } = require("telegraf");
const Calendar = require("telegraf-calendar-telegram");

getWeek = (future) => {
    let start = new Date(2022, 8, 1) // 1 september 2022
    start.setHours(0,0,0)
    future.setHours(0,0,0)
    let isFirstWeek = true
    do
    {
        const date = start.toLocaleDateString('default', {weekday: "long"})
        if (date === 'Monday') {
            isFirstWeek = !isFirstWeek;
        }

        start.setDate(start.getDate() + 1);
    } while(start.getTime() <= future.getTime());

    return isFirstWeek ? 1 : 2;
}

const bot = new Telegraf('5766718501:AAGaJVPisoD1tWWCe0gQVhqPZ9NM9LkqiUU');
const calendar = new Calendar(bot);

bot.command('today', (ctx) => {
    const future = new Date();
    
    const week = getWeek(future)
    ctx.reply(`${week}`)
});

bot.command('tomorrow', (ctx) => {
    let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const week = getWeek(tomorrow)
    ctx.reply(`${week}`)
});

calendar.setDateListener((ctx, date) => {
    const future = new Date(date);
    const today = new Date();
    if (future.getDate() < today.getDate()){
        ctx.reply(`Вы выбрали дату, которая уже прошла. Сегодня ${today.toLocaleDateString('ru-RU')}, выбрано ${future.toLocaleDateString('ru-RU')}`)
        return;
    }
    
    const week = getWeek(future)
    const localeDate = future.toLocaleDateString('ru-RU')
    ctx.reply(`На момент ${localeDate} номер недели будет ${week}`)
});

bot.command("will", context => context.reply("Выбери дату", calendar.getCalendar()));

bot.launch()