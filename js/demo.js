const ENDPOINT = 'http://kip-messenger.us-west-2.elasticbeanstalk.com'

function request(method, url, data) {
  return fetch(ENDPOINT + url, {
    method: method,
    body: JSON.stringify(data),
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    }
  }).then(function(resp) {
    return resp.json()
  })
}

const API = {
  processMessage: function (author, message) {
    return request('POST', '/processMessage', {
      author: author,
      message: message
    })
  }
}

class List {
  constructor(selector, settings = {}) {
    this.container = document.querySelector(selector)
    this.settings = settings
  }
  
  add(entry) {
    const element = document.createElement('li')
    element.classList.add(this.settings.itemClass)
    element.innerHTML = entry

    this.container.appendChild(element)
    this.container.scrollTop = this.container.scrollHeight
  }
}

function messageSendHandler(event) {
  event.preventDefault()
  const text = messageInput.value
  
  messages.add('Alex: ' + text)
  API.processMessage('Alex', text).then(function(resp) {
    if(typeof resp === 'object') {
      if(resp.type === 'task') {
        tasks.add(resp.output)
      } else if(resp.type === 'portrait') {
        portrait.add(resp.output)
      }
    }
  })
  
  messageInput.value = ''
}

const messages = new List('.message-list', {
  itemClass: 'list-group-item'
})
const tasks = new List('.task-list')
const portrait = new List('.psycho-list')
const form = document.getElementById('message-form')
const messageInput = document.getElementById('message-field')
form.addEventListener('submit', messageSendHandler)