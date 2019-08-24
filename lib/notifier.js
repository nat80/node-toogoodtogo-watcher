const notifier = require('node-notifier');
const { config } = require('./config');
const telegramBot = require('./telegram-bot');
const cache = {};

module.exports = {
    notifyIfChanged
};

function notifyIfChanged(businesses) {
    const message = createMessage(businesses);
    const options = config.get('notifications');
    if(options.console.enabled){
        notifyConsole(message);
    }
    if(cache.message !== message){
        if(options.desktop.enabled){
            notifyDesktop(message)
        }
        if(options.telegram.enabled){
            telegramBot.notify(message);
        }
        cache.message = message;
    }
}

function notifyConsole(message){
    console.clear();
    console.log(message + '\n');
}

function notifyDesktop(message){
    notifier.notify({ title: 'TooGoodToGo', message });
}

function createMessage(businesses){
    return businesses
        .map(business => `${ business.business_name } - ${business.todays_stock}`)
        .join('\n');
}