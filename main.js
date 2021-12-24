const createUserModel = document.querySelector(".create-user-model");
const openContactModel = document.querySelector(".create-message");
const closeModelBtn = document.querySelector(".fa-times");
const addUserBtn = document.querySelector(".fa-plus-square");
const contactsContainer = document.querySelector(".messages");
const messagesArea = document.querySelector(".search-container");
const chatArea = document.querySelector(".chat-container");
const backBtn = document.querySelector(".fa-arrow-left");
const searchInput = document.querySelector(".search");
const Days = ["Saturday", "Sunday", "Monday", "Tuseday", "Wednsday", "Thursday", "Firdays"];
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

backBtn.addEventListener("click", () => {
  chatArea.classList.remove("open-chat-area");
  messagesArea.classList.remove("close-search-container");
});

// open create contact model
openContactModel.addEventListener("click", () => {
  const createContainer = document.createElement("div");
  createContainer.classList.toggle("create-container");
  createUserModel.classList.add("open-model");
  document.body.appendChild(createContainer);
  closeModel(createContainer);
});

//  close create contact model
const closeModel = (elem) => {
  closeModelBtn.addEventListener("click", () => {
    elem.remove();
    createUserModel.classList.remove("open-model");
  });
};

function collectUserData() {
  const name = document.querySelector(".user-name").value;
  const about = document.querySelector(".user-about").value;
  const date = new Date();
  const hours = date.getHours() === 0 ? 12 : date.getHours();
  const min = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
  const id = Math.floor(Math.random() * 1000000);
  const userOb = {
    id: id,
    name: name,
    about: about,
    hours: hours,
    min: min,
    messages: {
      sendTo: [
        {
          id,
          name,
          message: {
            messageData: [],
          },
        },
      ],
    },
  };
  document.querySelector(".create-user-model").classList.toggle("open-model");
  document.querySelector(".create-container").remove();
  return userOb;
}

const checkInput = (name, about) => {
  if (name.trim().length === 0) return true;
  if (about.trim().length === 0) return true;
};

const clearFields = () => {
  document.querySelector(".user-name").value = "";
  document.querySelector(".user-about").value = "";
};

const addContactToArr = () => {
  const name = document.querySelector(".user-name").value;
  const about = document.querySelector(".user-about").value;
  if (checkInput(name, about) === true) return;
  const dataOBj = collectUserData();
  localStorageitems.push(dataOBj);
  addDataToLocalStorage(localStorageitems);
  displayContacts(localStorageitems);
  clearFields();
};

addUserBtn.addEventListener("click", () => {
  addContactToArr();
});

export function displayContacts(users) {
  contactsContainer.innerHTML = "";
  users.forEach((user) => {
    const conatctDiv = document.createElement("div");
    conatctDiv.classList.add("message");
    conatctDiv.setAttribute("data-id", user.id);
    conatctDiv.innerHTML = `
        <div class="profile-pic">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJkavvBVzIvdiccqhSgnOU96qDtz_Bkc4rLA&usqp=CAU" alt="" />
        </div>
        <div class="message-info">
          <div class="name">${user.name}</div>
          <div class="message-data">${user.about}</div>
        </div>
        <div class="time">${user.hours}:<span>${user.min} PM</span></div>
        `;
    contactsContainer.appendChild(conatctDiv);
  });
  const contacts = [...document.querySelectorAll(".messages .message")];
  openContactsChat(contacts);
}

function addDataToLocalStorage(data) {
  localStorage.setItem("users", JSON.stringify(data));
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
