const createUserModel = document.querySelector(".create-user-model");
const closeModelBtn = document.querySelector(".fa-times");
const openContactModel = document.querySelector(".create-message");
const chatArea = document.querySelector(".chat-container");
const messagesArea = document.querySelector(".search-container");
const backBtn = document.querySelector(".fa-arrow-left");
const emojiBtn = document.querySelector(".fa-laugh");
const addedName = document.querySelector(".user-name");
const addedMessage = document.querySelector(".user-message");
const searchInput = document.querySelector(".search");

export function formatTime() {
  let date = new Date();
  // let fullDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  let timeDay = date.getHours() >= 12 ? " PM" : " AM";
  let hours = date.getHours() === 0 ? 12 : date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
  let min = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
  // let sec = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();

  return {
    // fullDate: fullDate,
    hours: hours,
    min: min + timeDay,
    // sec: sec,
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
  document.querySelector("#profile-pic").value = "";
};

export function setCurrentContact(contact) {
  contact.classList.add("active-contact");
}

//  close create contact model
closeModelBtn.addEventListener("click", () => {
  clearUploadClass();
  clearFields();
  createUserModel.classList.remove("open-model");
});

// open create contact model
openContactModel.addEventListener("click", () => {
  createUserModel.classList.add("open-model");
});

backBtn.addEventListener("click", () => {
  chatArea.classList.remove("open-chat-area");
  messagesArea.classList.remove("close-search-container");
  closeEmojiModel();
});

export function checkInputLanguage(elem) {
  const arabic = /[\u0600-\u06FF\u0750-\u077F]/;
  const sendMessageValue = document.querySelector(".sendMessage");
  if (
    arabic.test(sendMessageValue.value) ||
    arabic.test(searchInput.value) ||
    arabic.test(addedName.value) ||
    arabic.test(addedMessage.value)
  ) {
    sendMessageValue.classList.add("arabic");
    searchInput.classList.add("arabic");
    addedName.classList.add("arabic");
    addedMessage.classList.add("arabic");
  } else {
    sendMessageValue.classList.remove("arabic");
    searchInput.classList.remove("arabic");
    addedName.classList.remove("arabic");
    addedMessage.classList.remove("arabic");
  }
  elem.forEach((msg) => {
    if (arabic.test(msg.textContent)) {
      msg.classList.add("arabic");
    }
  });
}

emojiBtn.addEventListener("click", () => {
  document.querySelector(".emoji-model").classList.toggle("open");
});

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("emoji-model")) return;
  if (e.target.closest(".emoji-model")) {
    console.log(e.target);
    const form = document.querySelector("form");
    form.sendMessage.value += e.target.textContent;
  }
});

export function closeEmojiModel() {
  document.querySelector(".emoji-model").classList.remove("open");
}

export async function getUserImage(file) {
  const fileInputDiv = document.querySelector(".file-upload");
  let image = await new Promise((reslove) => {
    let fileReader = new FileReader();
    fileReader.addEventListener("load", () => {
      reslove(fileReader.result);
      fileInputDiv.classList.add("uplaodCompleted");
    });
    fileReader.readAsDataURL(file);
  });
  return image;
}

export function clearUploadClass() {
  const inputFile = document.querySelector(".file-upload input");
  inputFile.value = "";

  document.querySelector(".file-upload").classList.remove("uplaodCompleted");
}
addedName.addEventListener("input", () => {
  checkInputLanguage([addedName]);
});

addedMessage.addEventListener("input", () => {
  checkInputLanguage([addedMessage]);
});

searchInput.addEventListener("input", () => {
  checkInputLanguage([searchInput]);
});
