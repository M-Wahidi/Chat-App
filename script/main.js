import { formatTime, addDataToLocalStorage, checkInput, clearFields, setCurrentContact, closeModel } from "./utils.js";
import { sendInitMessage } from "./chatMessages.js";
const addUserBtn = document.querySelector(".fa-plus-square");
const contactsContainer = document.querySelector(".messages");
const messagesArea = document.querySelector(".search-container");
const chatArea = document.querySelector(".chat-container");
const searchInput = document.querySelector(".search");
const localStorageitems = getDataToLocalStorage() || [];

export function userID(contact) {
  return contact;
}
export function sendUsersArr() {
  return localStorageitems;
}
function openContactsChat(contacts) {
  contacts.forEach((contact) => {
    contact.addEventListener("click", () => {
      messagesArea.classList.add("close-search-container");
      chatArea.classList.add("open-chat-area");
      userID(contact);
      sendUsersArr();
    });
  });
}

function collectUserData() {
  const name = document.querySelector(".user-name").value;
  const message = document.querySelector(".user-message").value;
  const id = Math.floor(Math.random() * 1000000);
  const userOb = {
    id: id,
    name: name,
    // pic:pic,
    message: message,
    hours: formatTime().hours,
    min: formatTime().min,
    messages: {
      sendTo: [
        {
          id,
          name,
          message: {
            messageData: [{ messageTime: `${formatTime().hours}:${formatTime().min}`, messageText: message }],
          },
        },
      ],
    },
  };
  document.querySelector(".create-user-model").classList.toggle("open-model");
  document.querySelector(".create-container").remove();
  return userOb;
}

const addContactToArr = () => {
  const name = document.querySelector(".user-name").value;
  const about = document.querySelector(".user-message").value;
  if (checkInput(name, about) === true) return;
  const dataOBj = collectUserData();
  localStorageitems.unshift(dataOBj);
  addDataToLocalStorage(localStorageitems);
  displayContacts(localStorageitems);
  clearFields();
};

addUserBtn.addEventListener("click", () => {
  addContactToArr();
  sendInitMessage();
});

export function displayContacts(users) {
  contactsContainer.innerHTML = "";
  users.forEach((user) => {
    const conatctDiv = document.createElement("div");
    conatctDiv.classList.add("message");
    conatctDiv.setAttribute("data-id", user.id);
    conatctDiv.innerHTML = `
        <div class="profile-pic">
          <img src="profile-pic.png" alt="" />
        </div>
        <div class="message-info">
          <div class="name">${user.name}</div>
          <div class="message-data"><span>${
            user.message.length > 20 ? user.message.slice(0, 20) + "..." : user.message
          }<span></div>
        </div>
        <div class="time">${user.hours}:<span>${user.min}</span></div>
        `;
    contactsContainer.appendChild(conatctDiv);
  });
  const contacts = [...document.querySelectorAll(".messages .message")];
  openContactsChat(contacts);
  if (contacts.length === 0) return;
  setCurrentContact(contacts[0]);
}

function getDataToLocalStorage() {
  const users = JSON.parse(localStorage.getItem("users"));
  return users;
}

searchInput.addEventListener("input", () => {
  const filteredName = localStorageitems.find((elem) => {
    return elem.name.toLowerCase() === searchInput.value.toLowerCase();
  });

  if (searchInput.value.length === 0) {
    displayContacts(localStorageitems);
  }

  const filteredArr = [];
  filteredArr.push(filteredName);

  if (filteredName == undefined) return;

  if (searchInput.value.length > 0) {
    displayContacts(filteredArr);
  }
});

displayContacts(localStorageitems);
