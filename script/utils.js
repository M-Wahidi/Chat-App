const createUserModel = document.querySelector(".create-user-model");
const closeModelBtn = document.querySelector(".fa-times");
const openContactModel = document.querySelector(".create-message");
const chatArea = document.querySelector(".chat-container");
const messagesArea = document.querySelector(".search-container");
const backBtn = document.querySelector(".fa-arrow-left");

export function formatTime() {
  let date = new Date();
  let timeDay = date.getHours() > 12 ? " PM" : " AM";
  let hours = date.getHours() === 0 ? 12 : date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
  let min = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
  return {
    hours: hours,
    min: min + timeDay,
  };
}

export function addDataToLocalStorage(data) {
  localStorage.setItem("users", JSON.stringify(data));
}

export const checkInput = (name, message) => {
  if (name.trim().length === 0) return true;
  if (message.trim().length === 0) return true;
};

export const clearFields = () => {
  document.querySelector(".user-name").value = "";
  document.querySelector(".user-message").value = "";
};

export function setCurrentContact(contact) {
  contact.classList.add("active-contact");
}

//  close create contact model
closeModelBtn.addEventListener("click", () => {
  clearFields();
  console.log("gg");
  createUserModel.classList.remove("open-model");
});

// open create contact model
openContactModel.addEventListener("click", () => {
  createUserModel.classList.add("open-model");
});

backBtn.addEventListener("click", () => {
  chatArea.classList.remove("open-chat-area");
  messagesArea.classList.remove("close-search-container");
});

export function checkInputLanguage(elem) {
  const arabic = /[\u0600-\u06FF\u0750-\u077F]/;
  const value = document.querySelector(".sendMessage");
  if (arabic.test(value.value)) {
    value.classList.add("arabic");
  } else {
    value.classList.remove("arabic");
  }
  elem.forEach((msg) => {
    if (arabic.test(msg.textContent)) {
      msg.classList.add("arabic");
    }
  });
}
