/// <reference types="../@types/jquery" />

var rowData = document.getElementById("rowData");
var searchArea = document.getElementById("searchArea");

$(document).ready(() => {
  getMeals().then(() => {
      $(".loading-screen").fadeOut(500)
      $("body").css("overflow", "visible")
  })
})



function openSideNav() {
    $(".side-nav-menu").animate({left: 0}, 500)
    for (let i = 0; i < 5; i++) {
        $(".links li").eq(i).animate({top: 0}, (i + 5) * 100)
    }
}

function closeSideNav() {
    let boxWidth = $(".side-nav-menu .nav-tab").outerWidth()
    $(".side-nav-menu").animate({left: -boxWidth}, 500)

    $(".links li").animate({top: 300}, 500)
}

closeSideNav()
$(".side-nav-menu i.open-close-icon").click(() => {
    if ($(".side-nav-menu").css("left") == "0px") {
        closeSideNav()
    } else {
        openSideNav()
    }
})



async function getMeals() {
  $(".inner-loading-screen").fadeIn(300)
  let response = await fetch(
    "https://www.themealdb.com/api/json/v1/1/search.php?s");
    console.log("works1")
  if (response.ok && 400 != response.status) {
    let finalResponse = await response.json();
    displayMeals(finalResponse);
    $(".inner-loading-screen").fadeOut(300)
  }
}

function displayMeals(items) {
  let data = ``;
  for (i = 0; i < items.meals.length; i++) {
    data += `<div class="col-md-3">
        <div onclick="getDetails('${items.meals[i].idMeal}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
        <img class="w-100" src="${items.meals[i].strMealThumb}" alt="" srcset="">
        <div class="meal-layer position-absolute d-flex justify-content-center align-items-center text-black p-2">
            <h3>${items.meals[i].strMeal}</h3>
        </div>
    </div>
    </div>
        `;
    rowData.innerHTML = data
  }

  
}
async function getDetails(id) {
  $(".inner-loading-screen").fadeIn(300)
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  if (response.ok && 400 != response.status) {
    let finalResponse = await response.json();
    let item = finalResponse.meals[0];
    let ingredients = ``;
    for (let i = 1; i <= 20; i++) {
      if (item[`strIngredient${i}`]) {
        ingredients += `<li class="alert alert-info m-2 p-1">${
          item[`strMeasure${i}`]
        } ${item[`strIngredient${i}`]}</li>`;
      }
    }
    let tags = item.strTags;
    if (item.strTags !== undefined && item.strTags !== null) {
      tags = item.strTags.split(",");
    } else {
      tags = undefined;
    }
    if (!tags) {
      tags = [];
    }
    console.log(tags);

    let tagsStr = "";
    for (let i = 0; i < tags.length; i++) {
      tagsStr += `
            <li class="alert alert-danger m-2 p-1">${tags[i]}</li>`;
    }
    let data = `
        <div class="col-md-4">
                    <img class="w-100 rounded-3" src="${item.strMealThumb}"
                        alt="">
                        <h2>${item.strMeal}</h2>
                </div>
                <div class="col-md-8">
                    <h2>Instructions</h2>
                    <p>${item.strInstructions}</p>
                    <h3><span class="fw-bolder">Area : </span>${item.strArea}</h3>
                    <h3><span class="fw-bolder">Category : </span>${item.strCategory}</h3>
                    <h3>Recipes :</h3>
                    <ul class="list-unstyled d-flex g-3 flex-wrap">
                        ${ingredients}
                    </ul>
    
                    <h3>Tags :</h3>
                    <ul class="list-unstyled d-flex g-3 flex-wrap">
                        ${tagsStr}
                    </ul>
    
                    <a target="_blank" href="${item.strSource}" class="btn btn-success">Source</a>
                    <a target="_blank" href="${item.strYoutube}" class="btn btn-danger">Youtube</a>
                </div>`;

    rowData.innerHTML = data;
    $(".inner-loading-screen").fadeOut(300)
  }
}

function searchInputs() {
  searchArea.innerHTML = `
    <div class="row py-4 ">
    <div class="col-md-6 ">
        <input onkeyup="searchName(this.value)" class="form-control bg-transparent " type="text" placeholder="Search By Name">
    </div>
    <div class="col-md-6">
        <input onkeyup="searchFLetter(this.value)" maxlength="1" class="form-control bg-transparent " type="text" placeholder="Search By First Letter">
    </div>
</div>`;
  rowData.innerHTML = " ";
  $(".inner-loading-screen").fadeOut(300)
}

async function searchName(data) {
  $(".inner-loading-screen").fadeIn(300)
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${data}`
  );
  if (response.ok && 400 != response.status) {
    let finalResponse = await response.json();
    displayMeals(finalResponse);
    $(".inner-loading-screen").fadeOut(300)
  }
}

async function searchFLetter(data) {
  $(".inner-loading-screen").fadeIn(300)
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?f=${data}`
  );
  if (response.ok && 400 != response.status) {
    let finalResponse = await response.json();
    displayMeals(finalResponse);
    $(".inner-loading-screen").fadeOut(300)
  }
}

async function categories() {
  $(".inner-loading-screen").fadeIn(300)
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/categories.php`
  );
  if (response.ok && 400 != response.status) {
    let finalResponse = await response.json();
    let cat = finalResponse.categories;
    displayCategories(cat);
    $(".inner-loading-screen").fadeOut(300)
  }
}

function displayCategories(cat) {
  let data = "";

  for (let i = 0; i < cat.length; i++) {
    data += `
        <div class="col-md-3">
                <div onclick="getCategoryMeals('${
                  cat[i].strCategory
                }')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                    <img class="w-100" src="${
                      cat[i].strCategoryThumb
                    }" alt="" srcset="">
                    <div class="meal-layer position-absolute text-center text-black p-2">
                        <h3>${cat[i].strCategory}</h3>
                        <p>${cat[i].strCategoryDescription
                          .split(" ")
                          .slice(0, 20)
                          .join(" ")}</p>
                    </div>
                </div>
            </div>
            `;
  }
  searchArea.innerHTML = " "
  rowData.innerHTML = data;
}

async function getCategoryMeals(cat){
  $(".inner-loading-screen").fadeIn(300)
    let response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat}`
      );
      if (response.ok && 400 != response.status) {
        let finalResponse = await response.json();
        displayMeals(finalResponse);
        $(".inner-loading-screen").fadeOut(300)
      }
}

async function getArea(){
  $(".inner-loading-screen").fadeIn(300)
    let response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
      );
      if (response.ok && 400 != response.status) {
        let finalResponse = await response.json();
        let data = finalResponse.meals
        displayArea(data);
        $(".inner-loading-screen").fadeOut(300)
      }
}

function displayArea (area){
    let data = "";

    for (let i = 0; i < area.length; i++) {
        data += `
        <div class="col-md-3">
                <div onclick="getAreaMeals('${area[i].strArea}')" class="rounded-2 text-center cursor-pointer">
                        <i class="bi bi-house-door-fill text-black fs-1"></i>
                        <h3 class="text-black">${area[i].strArea}</h3>
                </div>
        </div>
        `
    }
    searchArea.innerHTML = " "
    rowData.innerHTML = data
}

async function getAreaMeals(areaMeals){
  $(".inner-loading-screen").fadeIn(300)
    let response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?a=${areaMeals}`
      );
      if (response.ok && 400 != response.status) {
        let finalResponse = await response.json();
        let data = finalResponse
        displayMeals(data);
        $(".inner-loading-screen").fadeOut(300)
      }
}

async function getIngredients(){
  $(".inner-loading-screen").fadeIn(300)
    let response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
      );
      if (response.ok && 400 != response.status) {
        let finalResponse = await response.json();
        console.log(finalResponse.meals.slice(0, 20))
        displayIngredients(finalResponse.meals.slice(0, 20))
        $(".inner-loading-screen").fadeOut(300)
      }
}

function displayIngredients(ingrediant) {
    let data = "";

    for (let i = 0; i < ingrediant.length; i++) {
        data += `
        <div class="col-md-3">
                <div onclick="getIngredientsMeals('${ingrediant[i].strIngredient}')" class="rounded-2 text-center cursor-pointer text-black">
                        <i class="bi bi-bag-check-fill fs-1"></i>
                        <h3>${ingrediant[i].strIngredient}</h3>
                        <p>${ingrediant[i].strDescription.split(" ").slice(0,20).join(" ")}</p>
                </div>
        </div>
        `
    }
    searchArea.innerHTML = " "
    rowData.innerHTML = data
}

async function getIngredientsMeals (ingrediant){
  $(".inner-loading-screen").fadeIn(300)
    let response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingrediant}`
      );
      if (response.ok && 400 != response.status) {
        let finalResponse = await response.json();
        let data = finalResponse
        displayMeals(data);
  $(".inner-loading-screen").fadeOut(300)

      }
}

function nameValidation() {
  return (/^[a-zA-Z ]+$/.test(document.getElementById("nameInput").value))
}

function emailValidation() {
  return (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(document.getElementById("emailInput").value))
}

function phoneValidation() {
  return (/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(document.getElementById("phoneInput").value))
}

function ageValidation() {
  return (/^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test(document.getElementById("ageInput").value))
}

function passwordValidation() {
  return (/^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test(document.getElementById("passwordInput").value))
}

function repasswordValidation() {
  return document.getElementById("repasswordInput").value == document.getElementById("passwordInput").value
}

function inputsValidation() {
  if (nameInputTouched) {
      if (nameValidation()) {
          document.getElementById("nameAlert").classList.replace("d-block", "d-none")

      } else {
          document.getElementById("nameAlert").classList.replace("d-none", "d-block")

      }
  }
  if (emailInputTouched) {

      if (emailValidation()) {
          document.getElementById("emailAlert").classList.replace("d-block", "d-none")
      } else {
          document.getElementById("emailAlert").classList.replace("d-none", "d-block")

      }
  }

  if (phoneInputTouched) {
      if (phoneValidation()) {
          document.getElementById("phoneAlert").classList.replace("d-block", "d-none")
      } else {
          document.getElementById("phoneAlert").classList.replace("d-none", "d-block")

      }
  }

  if (ageInputTouched) {
      if (ageValidation()) {
          document.getElementById("ageAlert").classList.replace("d-block", "d-none")
      } else {
          document.getElementById("ageAlert").classList.replace("d-none", "d-block")

      }
  }

  if (passwordInputTouched) {
      if (passwordValidation()) {
          document.getElementById("passwordAlert").classList.replace("d-block", "d-none")
      } else {
          document.getElementById("passwordAlert").classList.replace("d-none", "d-block")

      }
  }
  if (repasswordInputTouched) {
      if (repasswordValidation()) {
          document.getElementById("repasswordAlert").classList.replace("d-block", "d-none")
      } else {
          document.getElementById("repasswordAlert").classList.replace("d-none", "d-block")

      }
  }


  if (nameValidation() && emailValidation() && phoneValidation() && ageValidation() && passwordValidation() && repasswordValidation()) {
      submitBtn.removeAttribute("disabled")
  } else {
      submitBtn.setAttribute("disabled", true)
  }
}


function showContacts() {
  rowData.innerHTML = `<div class="contact min-vh-100 d-flex justify-content-center align-items-center">
  <div class="container w-75 text-center">
      <div class="row g-4">
          <div class="col-md-6">
              <input id="nameInput" onkeyup="inputsValidation()" type="text" class="form-control" placeholder="Enter Your Name">
              <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                  Special characters and numbers not allowed
              </div>
          </div>
          <div class="col-md-6">
              <input id="emailInput" onkeyup="inputsValidation()" type="email" class="form-control " placeholder="Enter Your Email">
              <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                  Email not valid *exemple@yyy.zzz
              </div>
          </div>
          <div class="col-md-6">
              <input id="phoneInput" onkeyup="inputsValidation()" type="text" class="form-control " placeholder="Enter Your Phone">
              <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                  Enter valid Phone Number
              </div>
          </div>
          <div class="col-md-6">
              <input id="ageInput" onkeyup="inputsValidation()" type="number" class="form-control " placeholder="Enter Your Age">
              <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                  Enter valid age
              </div>
          </div>
          <div class="col-md-6">
              <input  id="passwordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Enter Your Password">
              <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                  Enter valid password *Minimum eight characters, at least one letter and one number:*
              </div>
          </div>
          <div class="col-md-6">
              <input  id="repasswordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Repassword">
              <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                  Enter valid repassword 
              </div>
          </div>
      </div>
      <button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
  </div>
</div> `
  submitBtn = document.getElementById("submitBtn")


  document.getElementById("nameInput").addEventListener("focus", () => {
      nameInputTouched = true
  })

  document.getElementById("emailInput").addEventListener("focus", () => {
      emailInputTouched = true
  })

  document.getElementById("phoneInput").addEventListener("focus", () => {
      phoneInputTouched = true
  })

  document.getElementById("ageInput").addEventListener("focus", () => {
      ageInputTouched = true
  })

  document.getElementById("passwordInput").addEventListener("focus", () => {
      passwordInputTouched = true
  })

  document.getElementById("repasswordInput").addEventListener("focus", () => {
      repasswordInputTouched = true
  })
}

let nameInputTouched = false;
let emailInputTouched = false;
let phoneInputTouched = false;
let ageInputTouched = false;
let passwordInputTouched = false;
let repasswordInputTouched = false;