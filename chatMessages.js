import { userID, sendUsersArr, displayContacts } from "./main.js";
const chatMessages = document.querySelector(".chat-messages");
const chatName = document.querySelector(".send-to");
const messages = document.querySelector(".messages");
const form = document.querySelector("form");
let foundName = "";
messages.addEventListener("click", async (e) => {
  if (!e.target.closest(".message")) return;
  const userData = sendUsersArr();
  const id = userID(e.target.closest(".message")).dataset.id;
  if (e.target.closest(".message")) {
    chatMessages.innerHTML = "";
    foundName = await userData.find((user) => user.id === Number(id));
    chatName.textContent = await foundName.name;
    addMessages(foundName);
    displayMessages();
  }
  scrollBottom();
});

let UserMessages = "";
function addMessages(user) {
  UserMessages = user.messages.sendTo[0].message.messageData;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const userInput = form.sendMessage.value;
  UserMessages.push(userInput);
  let newArr = sendUsersArr();
  newArr = newArr.filter((elem) => elem.id !== foundName.id);
  newArr.push(foundName);
  newArr = newArr.sort((a, b) => (a.id > b.id ? 1 : b.id > a.id ? -1 : 0));
  localStorage.setItem("users", JSON.stringify(newArr));
  displayMessages();
  scrollBottom();
  form.reset();
});

function displayMessages() {
  const messagesArr = foundName.messages.sendTo[0].message.messageData;
  chatMessages.innerHTML = "";
  messagesArr.map((elem) => {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("sender-message");
    messageDiv.textContent = elem;
    chatMessages.appendChild(messageDiv);
  });
  const resp = document.createElement("div");
  resp.classList.add("reciver-message");
  resp.textContent = `Hello This is ${foundName.name}, i will Contact u Later`;
  chatMessages.appendChild(resp);
}

function scrollBottom() {
  const bottom = chatMessages.scrollHeight;
  chatMessages.scrollTo({ top: bottom });
}
