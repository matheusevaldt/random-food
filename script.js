const buttonDisplayAddFood = document.querySelector('.button-display-add-food');
const formAddFood = document.querySelector('.form-add-food');
const inputAddFood = document.querySelector('.input-add-food');
const buttonAddFood = document.querySelector('.button-add-food');
const amountOfFoods = document.querySelector('.amount-of-foods');
const listOfFoods = document.querySelector('.list-of-foods');
const buttonGetFood = document.querySelector('.button-get-food');
const foodSelected = document.querySelector('.food-selected');

let foods = [];
let idFood = 0;

buttonAddFood.disabled = true;

buttonDisplayAddFood.addEventListener('click', displayAddFood);
inputAddFood.addEventListener('input', statusButtonAddFood);
buttonAddFood.addEventListener('click', event => event.preventDefault());
buttonAddFood.addEventListener('click', addFood);
buttonGetFood.addEventListener('click', getFood);

function displayAddFood() {
    buttonDisplayAddFood.style.display = 'none';
    formAddFood.style.display = 'block';
}

function statusButtonAddFood() {
    if (inputAddFood.value.length !== 0) {
        buttonAddFood.disabled = false;
        buttonAddFood.classList.add('button-add-food-enabled');
    } else {
        buttonAddFood.disabled = true;
        buttonAddFood.classList.remove('button-add-food-enabled')
    }
}

function addFood() {
    const food = inputAddFood.value;
    foods.push({id: idFood, food: food});
    idFood++;
    updateAmountOfFoods();
    updateListOfFoods();
    resetAddFood();
    if (foods.length === 1) displayGetFoodButton();
}

function updateAmountOfFoods() {
    const amount = foods.length === 1 ? 'food' : 'foods';
    amountOfFoods.innerHTML = `You have added ${foods.length} ${amount} so far.`;
}

function updateListOfFoods() {
    resetListOfFoods();
    foods.map((name, index) => {
        const li = document.createElement('li');
        const food = `<span class="food-highlight">${name.food}</span>`;
        const period = foods.length - 1 === index ? '.' : '';
        if (index === 0) {
            li.innerHTML = `${food}${period}`;
        } else {
            if (foods.length - 1 === index) {
                li.innerHTML = ` and ${food}${period}`;
            } else {
                li.innerHTML = `, ${food}${period}`;
            }
        }
        listOfFoods.appendChild(li);
    });
}

function resetListOfFoods() {
    while (listOfFoods.firstChild) {
        listOfFoods.removeChild(listOfFoods.firstChild);
    }
}

function resetAddFood() {
    inputAddFood.value = '';
    buttonAddFood.disabled = true;
    buttonAddFood.classList.remove('button-add-food-enabled')
}

function displayGetFoodButton() {
    buttonGetFood.style.display = 'block';
    console.log('DISPLAY GET FOOD BUTTON');
}

function getFood() {
    shuffleFoods();
    // const food = foods[Math.floor(Math.random() * foods.length)];
    // console.log(food.food);
}

function shuffleFoods() {
    for (let i = 0; i < foods.length; i++) {
        setTimeout(() => {
            foodSelected.innerHTML = foods[i].food;
        }, i * 2000);
    }
}