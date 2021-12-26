import { userID, sendUsersArr } from "./main.js";
import { formatTime, addDataToLocalStorage } from "./utils.js";

const chatMessages = document.querySelector(".chat-messages");
const chatName = document.querySelector(".send-to");
const messages = document.querySelector(".messages");
const form = document.querySelector("form");
const sendMessageBtn = document.querySelector(".fa-paper-plane");
const Days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Saturday",
  "Firday",
];
let foundName = "";

document.addEventListener("DOMContentLoaded", () => {
  displayCurrentMessages();
});

messages.addEventListener("click", async (e) => {
  if (!e.target.closest(".message")) return;
  const contacts = document.querySelectorAll(".message");
  contacts.forEach((contact) => {
    contact.classList.remove("active-contact");
  });
  e.target.closest(".message").classList.add("active-contact");
  showContact(e);
});

async function showContact(e) {
  const userData = sendUsersArr();
  const id = userID(e.target.closest(".message")).dataset.id;
  if (e.target.closest(".message")) {
    chatMessages.innerHTML = "";
    foundName = await userData.find((user) => user.id === Number(id));
    chatName.textContent = await foundName.name;
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
});
sendMessageBtn.addEventListener("click", getUserInput);

function getUserInput() {
  const userInput = form.sendMessage.value;
  if (userInput.trim().length === 0) return;
  const messageObj = {
    messageTime: `${formatTime().hours}:${formatTime().min}`,
    messageText: userInput,
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

form.addEventListener("submit", (e) => {
  e.preventDefault();
  getUserInput();
});

function displayMessages() {
  const messagesArr = foundName.messages.sendTo[0].message.messageData;
  chatMessages.innerHTML = "";
  const hours = formatTime().hours;
  const min = formatTime().min;
  const day = Days[new Date().getDay()];
  const dateDiv = document.createElement("div");
  dateDiv.classList.add("date");
  dateDiv.innerHTML = `
  <div class="date-info">${day}, ${hours}:${min}</div>
  `;
  chatMessages.appendChild(dateDiv);
  messagesArr.map((elem) => {
    const messageDiv = document.createElement("div");
    const messageDate = document.createElement("div");
    messageDiv.classList.add("sender-message");
    messageDiv.textContent = elem.messageText;
    messageDate.textContent = elem.messageTime;
    messageDiv.appendChild(messageDate);

    chatMessages.appendChild(messageDiv);
  });
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
  foundName = await sendUsersArr().find(
    (user) => user.id === Number(currentContactId)
  );
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
