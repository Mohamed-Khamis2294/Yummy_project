// ***spinner*************************
const spinner=document.querySelector('.spinner');
// ***nav*************************
function closeSideNav(x){
  const width=$('.nav').outerWidth();
  $('.nav').animate({left:-width},x);
  document.querySelector('.close').classList.add('d-none');
  document.querySelector('.open').classList.remove('d-none');
  $('.search').animate({top:'400px'},600);
  $('.Categories').animate({top:'400px'},800);
  $('.Area').animate({top:'400px'},1000);
  $('.Ingredients').animate({top:'400px'},1200);
  $('.Contact-Us').animate({top:'400px'},1400);
}
function openSideNav(){
  const width=$('.nav').outerWidth();
  $('.nav').animate({left:0},700);
  document.querySelector('.open').classList.add('d-none');
  document.querySelector('.close').classList.remove('d-none');
  $('.search').animate({top:'0px'},600);
  $('.Categories').animate({top:'0px'},800);
  $('.Area').animate({top:'0px'},1000);
  $('.Ingredients').animate({top:'0px'},1200);
  $('.Contact-Us').animate({top:'0px'},1400);
}
// *close-nav
$('.close').on('click',function(){
  closeSideNav(700)
});
// *open-nav
$('.open').on('click',openSideNav);
closeSideNav(0);
// *****************************************************
// ***first****************************************
async function searchFirst(){
  const searchEmpty=await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=')
  spinner.classList.add('d-none');
  const res=await searchEmpty.json();
  const{meals}=res;
  return meals;
}

async function displayFirst(x){
  document.querySelector('.foods').innerHTML='';
  // displayFirst(function(){return []});
 const arr=await x();
  arr.forEach(obj => {
    document.querySelector('.foods').insertAdjacentHTML('beforeend',`
<div class="food inner col-sm-6 col-md-4 col-lg-3">
      <div class="parent-layer rounded-2 p-0">
        <img src="${obj.strMealThumb}" alt="" class="d-block w-100 rounded-2">
        <div id="${obj.idMeal}" class="layer ">
          <p class="food-name fs-3 text-black fw-bold ms-2">${obj.strMeal}</p>
        </div>
      </div>
    </div>
`)
    
  });
}
displayFirst(searchFirst);
// *****************************************************
// **********details*********************************
async function detailsFetch(x){
  document.querySelector('.search-inputs').style.display='none';
  spinner.classList.replace('d-none','d-flex');
  const details=await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${x}`)
  spinner.classList.replace('d-flex','d-none');
  const res=await details.json();
  return res;
}

document.querySelector('.foods').addEventListener('click', function(e){
  const clicked=e.target.closest('.layer');
  if (!clicked)return;
  clicked.addEventListener('click',async function(e){
    document.querySelector('.foods').innerHTML='';
  const res=await detailsFetch(clicked.id);   
    const [obj]=res.meals;
    // console.log(obj);
    // *count ingradients
    let count=0;
    for(let i=1;i<=20;i++){
      if(obj[`strIngredient${i}`]!==''){
        count=i;
      // console.log(count);
      }
    }
    // ******
    document.querySelector('.foods').insertAdjacentHTML('beforeend',`
     <div class="col-md-4 text-white">
    <img src="${obj.strMealThumb}" alt="" class="d-block w-100 rounded-2">
    <h2>${obj.strMeal}</h2>
  </div>
  <div class="col-md-8 text-white">
    <h2>Instructions</h2>
    <p>${obj.strInstructions}</p>
    <h3>Area: ${obj.strArea}</h3>
    <h3>Category : ${obj.strCategory}</h3>
    <h3>Recipes :</h3>
    <ul class="list-unstyled d-flex g-3 flex-wrap">
   ${returnIngradients(count,obj)}
    </ul>
    <h3>Tags :</h3>
    <ul class="list-unstyled d-flex g-3 flex-wrap">
    ${returnTags(obj.strTags)}
    </ul>
    <a target="_blank" href="${obj.strYoutube}" class="btn btn-danger">Youtube</a>
    <a target="_blank" href="${obj.strSource}" class="btn btn-success">Source</a>
  </div> 
    `)
  })
})

function returnIngradients(x,y){
let cartona=``;
for(let i=1;i<=x;i++){
  cartona+=`<li class="alert alert-info m-2 p-1">${y[`strIngredient${i}`]}<span>${y[`strMeasure${i}`]}</span></li>`
}
return cartona;
}

function returnTags(x){
let cartona=``;
if (x===null)return cartona;
let arr= x.split(',');
arr.forEach(tag=>cartona+=`
<li class="alert alert-danger m-2 p-1">${tag}</li>
`)
return cartona;
}
// *****************************************************
// **********search*********************************
async function searchByName(x){
  spinner.classList.replace('d-none','d-flex');  
  const search=await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${x}`)
  spinner.classList.replace('d-flex','d-none');
  console.log(search);
  const res=await search.json();
  const{meals}=res;
  if (meals.length>20)meals.splice(20);
  return meals;
}

document.querySelector('.search-name').addEventListener('keyup',function(){
displayFirst(function(){
  return searchByName(document.querySelector('.search-name').value);
});
})
document.querySelector('.search-letter').addEventListener('keyup',function(){
displayFirst(function(){
  return searchByName(document.querySelector('.search-letter').value);
});
})
document.querySelector('.search').addEventListener('click',function(){
  document.querySelector('.contacts').classList.replace('d-flex','d-none')
  document.querySelector('.search-inputs').style.display='flex';
  document.querySelector('.foods').innerHTML='';
  closeSideNav(500);
})
// *****************************************************
// **********categories*********************************
async function fetchCat(){
  spinner.classList.replace('d-none','d-flex');  
  const cata=await fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
  spinner.classList.replace('d-flex','d-none');
  const res =await cata.json();
  const {categories}=res;
  return categories;
}
document.querySelector('.Categories').addEventListener('click',async function(){
  document.querySelector('.contacts').classList.replace('d-flex','d-none')
  closeSideNav(500);
  document.querySelector('.search-inputs').style.display='none';
  document.querySelector('.foods').innerHTML='';
  const arr = await fetchCat();
 arr.forEach(obj=> document.querySelector('.foods').insertAdjacentHTML('beforeend',`
 <div class="food inner col-sm-6 col-lg-3">
 <div class="parent-layer rounded-2 p-0">
   <img src="${obj.strCategoryThumb}" alt="" class="d-block w-100 rounded-2">
   <div id="${obj.strCategory}" class="cata flex-column">
     <p class="food-name fs-3 text-black fw-bold ms-2">${obj.strCategory}</p>
     <p class="text-center">${obj.strCategoryDescription.slice(0,70)}</p>
   </div>
 </div>
</div>
 `))
})

document.querySelector('.foods').addEventListener('click',async function(e){
  const clicked=e.target.closest('.cata');
  if(!clicked)return;
  spinner.classList.replace('d-none','d-flex');  
  const data=await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${clicked.id}`)
  spinner.classList.replace('d-flex','d-none');
  const res=await data.json();
  const {meals}=res;
  meals.splice(20);
   displayFirst(function(){
    return meals;
  })
})
// *****************************************************
// **********Areas*********************************
document.querySelector('.Area').addEventListener('click',async function(){
  document.querySelector('.contacts').classList.replace('d-flex','d-none')
  closeSideNav(500);
  document.querySelector('.search-inputs').style.display='none';
  document.querySelector('.foods').innerHTML='';
  spinner.classList.replace('d-none','d-flex');  
  const data=await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`)
  spinner.classList.replace('d-flex','d-none');
  const res=await data.json();
  const {meals}=res;
  meals.forEach(obj=>document.querySelector('.foods').insertAdjacentHTML('beforeend',`
 <div class="food inner col-sm-6 col-md-4 col-lg-3">
 <div id="${obj.strArea}" class="area">
 <i class="house fa-solid fa-house-laptop text-white"></i>
 <p class="house-text text-white ">${obj.strArea}</p>
</div>
  </div>
  `))
})
document.querySelector('.foods').addEventListener('click',async function(e){
  const clicked=e.target.closest('.area');
  if(!clicked)return;
  spinner.classList.replace('d-none','d-flex');  
  const data=await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${clicked.id}`)
  spinner.classList.replace('d-flex','d-none');
  const res=await data.json();
  const {meals}=res;
  meals.splice(20);
   displayFirst(function(){
    return meals;
  })
})
// *****************************************************
// **********ingradients*********************************
document.querySelector('.Ingredients').addEventListener('click',async function(){
  document.querySelector('.contacts').classList.replace('d-flex','d-none')
  closeSideNav(500);
  document.querySelector('.search-inputs').style.display='none';
  document.querySelector('.foods').innerHTML='';
  spinner.classList.replace('d-none','d-flex');  
  const data=await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`)
  spinner.classList.replace('d-flex','d-none');
  const res=await data.json();
  const {meals}=res;
  meals.splice(20);
  meals.forEach(obj=>document.querySelector('.foods').insertAdjacentHTML('beforeend',`
 <div id="${obj.strIngredient}" class="food inner col-sm-6 col-md-4 col-lg-3 text-white text-center ingrad">
 <i class="fa-solid fa-drumstick-bite house"></i>
 <p class="text-white fs-3">${obj.strIngredient}</p>
 <p>${obj.strDescription.slice(0,100)}</p>
</div>
  </div>
  `))
})

document.querySelector('.foods').addEventListener('click',async function(e){
  const clicked=e.target.closest('.ingrad');
  if(!clicked)return;
  spinner.classList.replace('d-none','d-flex');  
  const data=await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${clicked.id}`)
  spinner.classList.replace('d-flex','d-none');
  const res=await data.json();
  const {meals}=res;
  console.log(res);
  meals.splice(20);
   displayFirst(function(){
    return meals;
  })
})
// *****************************************************
// **********logo-backtohome*********************************
document.querySelector('.logo').addEventListener('click',function(){
  closeSideNav(500);
  document.querySelector('.contacts').classList.replace('d-flex','d-none')
  document.querySelector('.search-inputs').style.display='none';
  document.querySelector('.foods').innerHTML='';
  displayFirst(searchFirst);
})
// *****************************************************
// **********contact-us*********************************
document.querySelector('.Contact-Us').addEventListener('click',function(){
  closeSideNav(500);
  document.querySelector('.search-inputs').style.display='none';
  document.querySelector('.foods').innerHTML='';
  document.querySelector('.contacts').classList.replace('d-none','d-flex')
})

const regex={
  Name:/^[A-Za-z]+(([' -][A-Za-z ])?[A-Za-z]*)*$/,
  Email:/[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/,
  Phone:/^01[0125][0-9]{8}$/,
  Age:/^(0|[1-9][0-9]?)$/,
  Password:/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/,
  Repassword:/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/
}
document.querySelector('.contacts form').addEventListener('click',function(e){
  e.preventDefault();
  const clicked=e.target.closest('input');
  // console.log(clicked.nextElementSibling);
  if(!clicked)return;
  clicked.addEventListener('input',function(){
  if(!regex[clicked.id].test(clicked.value))
  {
    clicked.nextElementSibling.classList.replace('d-none','d-block')
  }else
  {
    clicked.nextElementSibling.classList.replace('d-block','d-none')
  }
  })
  if(regex.Name.test(`${document.querySelector('#Name').value}`)&&
  regex.Email.test(`${document.querySelector('#Email').value}`)&&
  regex.Age.test(`${document.querySelector('#Age').value}`)&&
  regex.Phone.test(`${document.querySelector('#Phone').value}`)&&
  regex.Password.test(`${document.querySelector('#Password').value}`)&&
  regex.Repassword.test(`${document.querySelector('#Repassword').value}`)&&
  (document.querySelector('#Password').value===document.querySelector('#Repassword').value)){
    console.log('kkkkk');
    document.querySelector('.btn1').removeAttribute('disabled');
  }else{
    document.querySelector('.btn1').setAttribute('disabled',true);
  }
})





