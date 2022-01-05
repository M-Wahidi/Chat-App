import {
  userID,
  sendUsersArr,
  setLastMessageInMessageArea,
  displayContacts,
  localStorageitems,
  sortContact,
} from "./main.js";
import { formatTime, addDataToLocalStorage, checkInputLanguage, setCurrentContact, closeEmojiModel } from "./utils.js";

const chatMessages = document.querySelector(".chat-messages");
const chatName = document.querySelector(".send-to");
const messages = document.querySelector(".messages");
const form = document.querySelector("form");
const sendMessageBtn = document.querySelector(".fa-paper-plane");
const Days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Saturday", "Firday"];
let foundName = "";
let currentActiveContact = "";

document.addEventListener("DOMContentLoaded", () => {
  displayCurrentMessages();
});

messages.addEventListener("click", (e) => {
  if (!e.target.closest(".message")) return;
  const contacts = document.querySelectorAll(".message");
  contacts.forEach((contact) => {
    contact.classList.remove("active-contact");
  });
  e.target.closest(".message").classList.add("active-contact");
  currentActiveContact = document.querySelector(".active-contact");
  setCurrentContact(currentActiveContact);
  showContact(e);
  closeEmojiModel();
});

export function getActiveContact() {
  const contacts = [...document.querySelectorAll(".message")];
  const setActiveContact = contacts.filter((elem) => elem.dataset.id === currentActiveContact.dataset.id);
  setCurrentContact(setActiveContact[0]);
}

function showContact(e) {
  const userData = sendUsersArr();
  const id = userID(e.target.closest(".message")).dataset.id;
  if (e.target.closest(".message")) {
    chatMessages.innerHTML = "";
    foundName = userData.find((user) => user.id === Number(id));
    chatName.textContent = foundName.name;
    addMessages(foundName);
    displayMessages();
  }
}
let UserMessages = "";

function addMessages(user) {
  UserMessages = user.messages.sendTo[0].message.messageData;
}
form.addEventListener("input", () => {
  addMessages(foundName);
  currentActiveContact = document.querySelector(".active-contact");
  checkInputLanguage([form.sendMessage]);
  getActiveContact();
});
form.addEventListener("submit", (e) => {
  e.preventDefault();
  getUserInput();
  setLastMessageInMessageArea();
  sortContact();
  displayContacts(localStorageitems);
  getActiveContact();
});

sendMessageBtn.addEventListener("click", (e) => {
  e.preventDefault();
  getUserInput();
  setLastMessageInMessageArea();
  sortContact();
  displayContacts(localStorageitems);
  getActiveContact();
});

function getUserInput() {
  const userInput = form.sendMessage.value;
  if (userInput.trim().length === 0) return;
  const messageObj = {
    messageTime: `${formatTime().hours}:${formatTime().min}`,
    messageText: userInput,
    sortByDate: new Date().toLocaleString(),
  };

  UserMessages.push(messageObj);
  let currentContact = sendUsersArr();

  currentContact = currentContact.map((contact) => {
    if (contact.id === foundName.id) {
      contact.messages.sendTo[0].message.messageData = [];
      contact.messages.sendTo[0].message.messageData.push(...UserMessages);
    }
    return contact;
  });

  addDataToLocalStorage(currentContact);
  displayMessages();
  scrollBottom();
  form.reset();
  setTimeout(respondMessage, 2000);
}

document.querySelector(".fa-laugh").addEventListener("click", () => {
  addMessages(foundName);
  const contacts = [...document.querySelectorAll(".message")];
  const activeContact = document.querySelector(".active-contact");
  currentActiveContact = activeContact;
  contacts.forEach((contact) => {
    contact.classList.remove("active-contact");
  });
  setCurrentContact(activeContact);
});

function displayMessages() {
  const messagesArr = foundName.messages.sendTo[0].message.messageData;
  chatMessages.innerHTML = "";
  const getLiveTime = () => {
    return {
      hours: formatTime().hours,
      min: formatTime().min,
      day: Days[new Date().getDay()],
    };
  };
  const dateInfoDiv = document.createElement("div");
  dateInfoDiv.classList.add("date-info");

  setInterval(() => {
    dateInfoDiv.innerHTML = `${getLiveTime().day},${getLiveTime().hours}:${getLiveTime().min}`;
  }, 10);

  const dateDiv = document.createElement("div");
  dateDiv.classList.add("date");
  dateDiv.appendChild(dateInfoDiv);
  chatMessages.appendChild(dateDiv);
  messagesArr.forEach((elem) => {
    const messageDiv = document.createElement("div");
    const messageDate = document.createElement("div");
    messageDiv.classList.add("sender-message");
    messageDiv.textContent = elem.messageText;
    messageDate.textContent = elem.messageTime;
    messageDiv.appendChild(messageDate);
    chatMessages.appendChild(messageDiv);
  });
  checkInputLanguage([...document.querySelectorAll(".sender-message")]);
  scrollBottom();
}

async function displayCurrentMessages() {
  if (sendUsersArr().length === 0) {
    chatName.textContent = "";
    return;
  }
  const defaultContact = sendUsersArr()[0];
  const contact = [...document.querySelectorAll(".messages .message")];
  chatName.textContent = defaultContact.name;
  contact[0].classList.add("active-contact");
  const currentContactId = userID(contact[0]).dataset.id;
  foundName = await sendUsersArr().find((user) => user.id === Number(currentContactId));
  displayMessages();
}

function respondMessage() {
  const resp = document.createElement("div");
  resp.classList.add("reciver-message");
  resp.textContent = `Hello This is ${foundName.name}, i will Contact u later`;
  chatMessages.appendChild(resp);
  scrollBottom();
}
function scrollBottom() {
  const bottom = chatMessages.scrollHeight;
  chatMessages.scrollTo({ top: bottom });
}
export function sendInitMessage() {
  chatMessages.innerHTML = "";
  chatName.textContent = sendUsersArr()[0].name;
  displayCurrentMessages();
}
