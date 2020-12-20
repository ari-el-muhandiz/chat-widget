import fetch from 'isomorphic-unfetch';
const Chat = require('twilio-chat');

function fetchToken () {
  const resp = fetch('http://localhost:3000/api/chat', {
    method: 'POST',
    headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json;charset=UTF-8'
    },
    body: JSON.stringify({
    identity: 'demo'
    })
  });
  return resp;
}

function initChannel(token) {
    let generalChannel = null;
    return new Promise((resolve, reject) => {
        return Chat.Client.create(token)
        .then((client) => {
            return client.getPublicChannelDescriptors();
        }).then((channelObject) => {
            const channels = channelObject.items;
            for(let i=0; i  < channels.length; i++) {
                if (channels[i].uniqueName === 'demo') {
                  generalChannel = channels[i];
                  break;
                }
            }
            if (!generalChannel) {
                 return client.createChannel({
                  uniqueName: 'demo',
                  friendlyName: 'demo'
                });
            } 
            return Promise.resolve(generalChannel)
        }).then((channel) => {
            const client = channel.client;
            return client.getChannelBySid(channel.sid);
        }).then((_channel) => {
          if (_channel.channelState.status !== 'joined')  {
              return _channel.join()
          }
          return Promise.resolve(_channel)
        }).then((myChannel) => {
            resolve(myChannel);
        }).catch((err) => {
            reject(err);
        })
    })
    
    
}
  
function getMessages(channel) {
    return new Promise((resolve, reject) => {
        return channel.getMessages()
        .then((messages) => {
            resolve(messages);
        }).catch(err => {
            reject(err);
        }) 
    })
  }
  
  export { fetchToken, getMessages, initChannel }