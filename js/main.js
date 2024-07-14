$(document).ready(function(){
    $('.loading-screen').fadeOut(500);
    $('body').css('overflow','visible')
})
getMeals()


navWidth = $('nav').outerWidth();
function closeNav(){
    $('aside').animate({left : `-${navWidth}px`})
    $('.fa-xmark').addClass('d-none')
    $('.fa-bars').removeClass('d-none')
}
$('.fa-xmark').click(function(){
    closeNav()
})

$('.fa-bars').click(function(){
    $('aside').animate({left : `0px`})
    wow = new WOW(
        {
        boxClass:     'wow',      // default
        animateClass: 'animated', // default
        offset:       0,          // default
        mobile:       true,       // default
        live:         true        // default
    }
    )
    wow.init();
    
    $('.fa-bars').addClass('d-none')
    $('.fa-xmark').removeClass('d-none')
})

listOfMeals = []
async function getMeals(name=''){
    $('.loading-screen').fadeIn(200);

    var url = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`)
        var data = await url.json();
        listOfMeals = data.meals;

        if(listOfMeals != null){
            displayMeals(listOfMeals)
        }
        else{
            listOfMeals = []
            displayMeals(listOfMeals)
        }
        $('.loading-screen').fadeOut(200);
}

$('.search-by-name').on('input',function(e){
    $('.contact-us').addClass('d-none')
    var term =e.target.value.toLowerCase().trim();
    if(term !=''){
        getMeals(term)
    }
})

async function getMealsByFirstLetter(letter){
    $('.loading-screen').fadeIn(200);

    var url = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`)
        var data = await url.json();
        listOfMeals = data.meals;
        displayMeals(listOfMeals)
        $('.loading-screen').fadeOut(200);
}
$('.search-first-letter').on('input',function(e){
    $('.contact-us').addClass('d-none')
    let term =e.target.value.toLowerCase().trim();
    if(term !=''){
        getMealsByFirstLetter(term)
    }
    else{
        getMealsByFirstLetter('a')
    }
})


$('aside nav li').eq(0).click(function(){
    closeNav()
    $('#Row').empty()
    $('.search-input').removeClass('d-none')
    $('.contact-us').addClass('d-none')
})


function displayMeals(arr){
    let box ='';
    for(let i=0 ; i<arr.length;i++){
        box +=`<div class="col-md-3 meal overflow-hidden">
                <div class="inner position-relative w-100 h-100" onclick="getDetails('${arr[i].idMeal}')">
                    <img src="${arr[i].
                        strMealThumb}" class="rounded-2" alt="">
                    <div class="layout position-absolute d-flex align-items-center p-2">
                        <h3>${arr[i].strMeal}</h3>
                    </div>
                </div>
            </div>`
    }
    $('#Row').html(box);
}

let detailsObj ={}
async function getDetails(id){
    $('#Row').empty()
    $('.loading-screen').fadeIn(200);

    var url = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
        var data = await url.json();
        detailsObj = data.meals[0];
        console.log(detailsObj)
        displayDetails()

    $('.loading-screen').fadeOut(200);
}
function displayDetails(){
    box=''
    box = `<div class="col-md-4 text-white">
                <img src="${detailsObj.strMealThumb}" alt=""class="w-100 rounded-2 mb-2">
                <h2>${detailsObj.strMeal}</h2>
            </div>
            <div class="col-md-8 text-white">
                <h2>Instructions</h2>
                <p>${detailsObj.strInstructions}</p>
                <h2>Area : ${detailsObj.strArea}</h2>
                <h2>Category : ${detailsObj.strCategory}</h2>
                <h3>Recipes :</h3>
                <div class="d-flex flex-wrap row-gap-3 column-gap-3 my-4">
            `
    for(let i = 1; i <= 20; i++){
        if(detailsObj[`strIngredient${i}`] != null &&detailsObj[`strIngredient${i}`] != ""){
            box+=`
                <a class="btn blue" href="#" role="button">
                ${detailsObj[`strMeasure${i}`]} ${detailsObj[`strIngredient${i}`]}
            </a>
            `
        }
    }

    box+=`</div>
        <h3>Tags :</h3>
        <div class="d-flex flex-wrap row-gap-3 column-gap-3 my-4">`
    if(detailsObj.strTags != null){
        for(let i = 0; i <detailsObj.strTags?.split(",").length; i++){
            box+=`<a class="btn pink" href="#" role="button">
                    ${detailsObj.strTags?.split(",")[i]}</a>`
        }
    }
    box+=`</div>
                <a href="${detailsObj.strSource} role="button" class="btn btn-success">Source</a>
                <a href="${detailsObj.strYoutube} role="button" class="btn btn-danger">Youtube</a>
            </div>`
    $('#Row').html(box);
}
////////////////////////Categories///////////////////////////
async function getCategories(){
    $('.loading-screen').fadeIn(200);

    var url = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
        var data = await url.json();
        listOfMeals = data.categories;
        displayCategories(listOfMeals)
        $('.loading-screen').fadeOut(200);
}

function displayCategories(arr) {
    let box = "";

    for (let i = 0; i < arr.length; i++) {
        box += `
        <div class="col-md-3">
                <div class="inner position-relative overflow-hidden rounded-2 cursor-pointer p-2"
                onclick="getCategoryMeals('${arr[i].strCategory}')">
                    <img class="w-100" src="${arr[i].strCategoryThumb}" alt="" srcset="">
                    <div class="layout position-absolute text-center text-black p-2 rounded-2">
                        <h3>${arr[i].strCategory}</h3>
                        <p>${arr[i].strCategoryDescription.split(" ").slice(0,10).join(" ")}</p>
                    </div>
                </div>
        </div>
        `
    }
    $('#Row').html(box);
}
$('aside nav li').eq(1).click(function(){
    closeNav()
    $('#Row').empty()
    $('.search-input').addClass('d-none')
    $('.contact-us').addClass('d-none')
    getCategories()
})

async function getCategoryMeals(stringCategory){
    $('#Row').empty()
    $('.loading-screen').fadeIn(200);

    var url = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${stringCategory}`)
        var data = await url.json();
        console.log(data.meals)
        listOfMeals = data.meals
        displayMeals(listOfMeals.slice(0,20))
        $('.loading-screen').fadeOut(200);
}

////////////////////////Area///////////////////////////
async function getArea(){
    $('.loading-screen').fadeIn(200);

    var url = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`)
        var data = await url.json();
        listOfMeals = data.meals;
        displayArea(listOfMeals)

    $('.loading-screen').fadeOut(200);
}

function displayArea(arr) {
    let box = "";

    for (let i = 0; i < arr.length; i++) {
        box += `
        <div class="col-md-3 text-white text-center" onclick="getAreaMeals('${arr[i].strArea}')">
            <i class="fa-solid fa-house-laptop fa-10x"></i>
            <h2>${arr[i].strArea}</h2>
        </div>
            `
    }
    $('#Row').html(box);
}
$('aside nav li').eq(2).click(function(){
    closeNav()
    $('#Row').empty()
    $('.search-input').addClass('d-none')
    $('.contact-us').addClass('d-none')
    getArea()
})

async function getAreaMeals(stringArea){
    $('#Row').empty()
    $('.loading-screen').fadeIn(200);

    var url = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${stringArea}`)
        var data = await url.json();
        console.log(data.meals)
        listOfMeals = data.meals
        displayMeals(listOfMeals.slice(0,20))
        $('.loading-screen').fadeOut(200);
}

////////////////////////Ingredients//////////////////////////
async function getIngredients(){
    $('.loading-screen').fadeIn(200);

    var url = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`)
        var data = await url.json();
        listOfMeals = data.meals.slice(0,20);
        displayIngredients(listOfMeals)

    $('.loading-screen').fadeOut(200);
}

function displayIngredients(arr) {
    let box = "";

    for (let i = 0; i < arr.length; i++) {
        box += `
        <div class="col-md-3 text-white text-center"
        onclick="getIngredientsMeals('${arr[i].strIngredient}')">
                <i class="fa-solid fa-drumstick-bite fa-5x"></i>
                <h2>${arr[i].strIngredient}</h2>
                <p>${arr[i].strDescription?.split(" ").slice(0,20).join(" ")}</p>
        </div>
        `
    }
    $('#Row').html(box);
}
$('aside nav li').eq(3).click(function(){
    closeNav()
    $('#Row').empty()
    $('.search-input').addClass('d-none')
    $('.contact-us').addClass('d-none')
    getIngredients()
})

async function getIngredientsMeals(stringIngredients){
    $('#Row').empty()
    $('.loading-screen').fadeIn(200);

    var url = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${stringIngredients}`)
        var data = await url.json();
        console.log(data.meals)
        listOfMeals = data.meals
        displayMeals(listOfMeals.slice(0,20))
        $('.loading-screen').fadeOut(200);
}

///////////////////////////contact-us////////////////////////
$('aside nav li').eq(4).click(function(){
    closeNav()
    $('.contact-us form input + div').eq(3).addClass('d-none')
    $('#Row').empty()
    $('.search-input').removeClass('d-none')
    $('.contact-us').removeClass('d-none')
})


$('.contact-us form input').eq(0).on('input',function(e){
    isValidName()
})
$('.contact-us form input').eq(1).on('input',function(e){
    isValidMail()
})
$('.contact-us form input').eq(2).on('input',function(e){
    isValidPhone()
})
$('.contact-us form input').eq(3).on('input',function(e){
    isValidAge()
})
$('.contact-us form input').eq(4).on('input',function(e){
    isValidPassword()
})
$('.contact-us form input').eq(5).on('input',function(e){
    isValidRepassword()
})

function isValidName() {
    let regname = new RegExp('^[a-zA-Z ]+$')
if(regname.test($('.contact-us form input').eq(0).val())){
    $('.contact-us form input + div').eq(0).addClass('d-none')
    return true
}
else{
    $('.contact-us form input + div').eq(0).removeClass('d-none')
    return false;
}
}

function isValidMail() {
    let regEmail = new RegExp('[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+')
if(regEmail.test($('.contact-us form input').eq(1).val())){
    $('.contact-us form input + div').eq(1).addClass('d-none')
    return true
}
else{
    $('.contact-us form input + div').eq(1).removeClass('d-none')
    return false;
}
}

function isValidPhone() {
    let regpho = new RegExp('^(01)[0-25][0-9]{8}$')
if(regpho.test($('.contact-us form input').eq(2).val())){
    $('.contact-us form input + div').eq(2).addClass('d-none')
    return true
}
else{
    $('.contact-us form input + div').eq(2).removeClass('d-none')
    return false;
}
}

function isValidAge() {
    let regAge = new RegExp('^([5-9]|[1-8][0-9]|(90))$')
if(regAge.test($('.contact-us form input').eq(3).val())){
    $('.contact-us form input + div').eq(3).addClass('d-none')
    return true
}
else{
    $('.contact-us form input + div').eq(3).removeClass('d-none')
    return false;
}
}

function isValidPassword() {
    let regPass = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/
if(regPass.test($('.contact-us form input').eq(4).val())){
    $('.contact-us form input + div').eq(4).addClass('d-none')
    return true
}
else{
    $('.contact-us form input + div').eq(4).removeClass('d-none')
    return false;
}
}
function isValidRepassword() {
    if($('.contact-us form input').eq(5).val() == $('.contact-us form input').eq(4).val()){
        $('.contact-us form input + div').eq(5).addClass('d-none')
        return true
    }
    else{
        $('.contact-us form input + div').eq(5).removeClass('d-none')
        return false;
    }
}
let btndisabled =document.querySelector('.btn-outline-danger')
if(isValidAge() && isValidMail() && isValidName() && isValidPassword() && isValidPhone() && isValidRepassword()){
    btndisabled.removeAttribute("disabled")
}
else{
    btndisabled.setAttribute("disabled", true)
}
// async function getLocation(location){
//     var url = await fetch(`https://api.weatherapi.com/v1/search.json?key=2d28e8ff822e437f93b131622242506&q=${location}`)
//     var data = await url.json();
//     if(data[0]!='' && data[0]!=null){
//         getCountry(location);
//     }
// }
// getLocation("cairo");

// var search = document.getElementById('search');
// search.addEventListener('input',function(e){
//     var term =e.target.value.toLowerCase().trim();
//     if(term !=''){
//         getLocation(term)
//     }
// })



// var wearherList=[]
// var wearherLocation=[]
// async function getCountry(country,id){
//     var url = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=2d28e8ff822e437f93b131622242506&q=${country}&days=3`)
//     var data = await url.json();
//     wearherList = (data.forecast.forecastday);
//     wearherLocation =data.location
//     display()
// }
// var weekday = ['Saturday','Sunday','Monday','Tuesday','Wednesday','Thursday','Fryday']
// var momthday = ['January','February','March','April','May','June','Juli','August','September','October','November','December']
// const d = new Date();


// var firstDay = document.getElementById('day1');
// var secoundDay = document.getElementById('day2');
// var thirdDay = document.getElementById('day3');
