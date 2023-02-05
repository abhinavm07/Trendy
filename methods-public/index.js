const opdEl = document.getElementById("userID");
const unameEl = document.getElementById("username");
const fnameEl = document.getElementById("name");
const addressEl = document.getElementById("address");
const dobEl = document.getElementById("dob");
const ageEl = document.getElementById("age");
const sexEl = document.getElementById("sex");
const delteEl = document.getElementById("delete-btn");

const buttonEl = document.getElementById("submitData");

const arreyYar = [opdEl, unameEl, fnameEl, addressEl, dobEl, ageEl, sexEl];

const objIndex = [
  "User ID",
  "username",
  "fullName",
  "address",
  "dob",
  "age",
  "sex",
];

let data = [];
let obj = {};
let infoRendered = false;

buttonEl.addEventListener("click", renderInfo);

function renderInfo() {
  // obj = JSON.parse(localStorage.getItem("userData"));
  for (let i = 0; i < arreyYar.length; i++) {
    if (arreyYar[i].value) {
      if (arreyYar[i] === opdEl) {
        data.push(parseInt(arreyYar[i].value));
      } else {
        data.push(arreyYar[i].value);
      }
    } else {
      // alert(`${objIndex[i]} EMPTY !`)
      // console.log(`Field Empty at ${objIndex[i]}`)
    }
  }
  if (data && opdEl.value) {
    console.log(data);
    obj[parseInt(opdEl.value)] = data;
    data = [];
    console.log(obj);
    localStorage.setItem("userData", JSON.stringify(obj));
    clearValue();
    infoRendered = true;
  } else {
    console.log("Fields Empty");
  }
}
console.log(infoRendered);

if (infoRendered) {
  console.log(localStorage.getItem("userData"));
}

delteEl.addEventListener("click", deleteData);

function deleteData() {
  localStorage.clear();
  console.log(localStorage);
}

function clearValue() {
  obj = {};
  for (let i = 0; i < arreyYar.length; i++) {
    arreyYar[i].value = "";
  }
}
