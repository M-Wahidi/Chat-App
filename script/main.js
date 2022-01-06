import {
  formatTime,
  addDataToLocalStorage,
  checkInput,
  clearFields,
  closeEmojiModel,
  getUserImage,
  clearUploadClass,
} from "./utils.js";
import { sendInitMessage } from "./chatMessages.js";
const addUserBtn = document.querySelector(".fa-plus-square");
const contactsContainer = document.querySelector(".messages");
const messagesArea = document.querySelector(".search-container");
const chatArea = document.querySelector(".chat-container");
export const searchInput = document.querySelector(".search");
const fileInput = document.querySelector("#profile-pic");
export const localStorageitems = getDataToLocalStorage() || [];
let userImage = "";
const x = window.matchMedia("(max-width: 836px)");

// Event Handler
document.addEventListener("keydown", (e) => {
  if (e.code === "Tab" && x.matches) {
    e.preventDefault();
  }
});

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

addUserBtn.addEventListener("click", () => {
  closeEmojiModel();
  addContactToArr();
  sendInitMessage();
});

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

fileInput.addEventListener("change", () => {
  getUserImage(fileInput.files[0])
    .then((data) => {
      userImage = data;
    })
    .catch((err) => {
      console.log(err + " something happend");
    });
});

function collectUserData() {
  const name = document.querySelector(".user-name").value;
  const message = document.querySelector(".user-message").value;
  const id = Math.floor(Math.random() * 1000000);
  const userOb = {
    id: id,
    name: name,
    pic: userImage,
    message: message,
    hours: formatTime().hours,
    min: formatTime().min,
    messages: {
      sendTo: [
        {
          id,
          name,
          message: {
            messageData: [
              {
                messageTime: `${formatTime().hours}:${formatTime().min}`,
                messageText: message,
                sortByDate: new Date().toLocaleString(),
              },
            ],
          },
        },
      ],
    },
  };
  document.querySelector(".create-user-model").classList.toggle("open-model");
  clearUploadClass();
  userImage = "";
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

export function getFirstContactAdded() {
  return [...document.querySelectorAll(".messages .message")];
}

export function displayContacts(users) {
  contactsContainer.innerHTML = "";
  users.forEach((user) => {
    const conatctDiv = document.createElement("div");
    conatctDiv.classList.add("message");
    conatctDiv.setAttribute("data-id", user.id);
    conatctDiv.innerHTML = `
        <div class="profile-pic">
          <img src=${user.pic || "/app_images/ProfilePicture.png"} alt="" />
        </div>
        <div class="message-info">
          <div class="name">${user.name}</div>
          <div class="message-data"><span>${
            user.message.length > 20 ? user.message.slice(0, 15) + "..." : user.message
          }<span></div>
        </div>
        <div class="time">${user.hours}:<span>${user.min}</span></div>
        `;
    contactsContainer.appendChild(conatctDiv);
  });
  const contacts = [...document.querySelectorAll(".messages .message")];
  openContactsChat(contacts);
  if (contacts.length === 0) return;
}

function getDataToLocalStorage() {
  const users = JSON.parse(localStorage.getItem("users"));
  return users;
}

export function setLastMessageInMessageArea() {
  localStorageitems.map((contact) => {
    const messagesLength = contact.messages.sendTo[0].message.messageData.length;
    const lastMessage = contact.messages.sendTo[0].message.messageData[messagesLength - 1];
    const lastMessageText = lastMessage.messageText;
    const lastMessageTime = lastMessage.messageTime;
    const lastMessageTimeHour = lastMessageTime.toString().split(":")[0];
    const lastMessageTimeMin = lastMessageTime.toString().split(":")[1];
    contact.message = lastMessageText;
    contact.hours = lastMessageTimeHour;
    contact.min = lastMessageTimeMin;
  });
  addDataToLocalStorage(localStorageitems);
}

export function sortContact() {
  const sortContact = localStorageitems.sort((a, b) => {
    if (
      a.messages.sendTo[0].message.messageData[a.messages.sendTo[0].message.messageData.length - 1].sortByDate >
      b.messages.sendTo[0].message.messageData[b.messages.sendTo[0].message.messageData.length - 1].sortByDate
    ) {
      return -1;
    }
    if (
      a.messages.sendTo[0].message.messageData[a.messages.sendTo[0].message.messageData.length - 1].sortByDate <
      b.messages.sendTo[0].message.messageData[b.messages.sendTo[0].message.messageData.length - 1].sortByDate
    ) {
      return 1;
    }
    return 0;
  });
  addDataToLocalStorage(sortContact);
}

setLastMessageInMessageArea();
displayContacts(localStorageitems);
