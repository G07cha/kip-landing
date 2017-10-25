const ENDPOINT = 'http://cors-anywhere.herokuapp.com/http://kip-messenger.us-west-2.elasticbeanstalk.com'

function request(url) {
  return fetch(ENDPOINT + url).then(function(resp) {
    return resp.json()
  })
}

const API = {
  processMessage: function (author, message) {
    return request(`/processMessage?author=${author}&message=${message}`)
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
  const author = 'Alex'
  
  messages.add(author + ': ' + text)
  API.processMessage(author, text).then(function(resp) {
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