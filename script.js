const buttonDisplayAddFood = document.querySelector('.button-display-add-food');
const formAddFood = document.querySelector('.form-add-food');
const inputAddFood = document.querySelector('.input-add-food');
const buttonAddFood = document.querySelector('.button-add-food');
const amountOfFoods = document.querySelector('.amount-of-foods');
const listOfFoods = document.querySelector('.list-of-foods');
const buttonGetFood = document.querySelector('.button-get-food');
const foodSelected = document.querySelector('.food-selected');
const loadingSpinner = document.querySelector('.loading-spinner');

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
    inputAddFood.focus();
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
    inputAddFood.focus();
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
        const separation = foods.length - 1 === index ? ' and ' : ', ';
        if (index === 0) {
            li.innerHTML = `${food}${period}`;
        } else {
            li.innerHTML = `${separation}${food}${period}`;
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
}

async function getFood() {
    await shuffleFoods();
    await loadFoodSelected();
    await displayFoodSelected();
}

async function shuffleFoods() {
    await new Promise(resolve => {
        for (let i = 0; i < foods.length; i++) {
            setTimeout(() => {
                foodSelected.innerHTML = foods[i].food;
                console.log(foods[i].food);
                foodSelected.classList.add('a');
                setTimeout(() => foodSelected.classList.remove('a'), 900)
                if (i === foods.length - 1) resolve();
            }, i * 1000);
        }
    });
}

async function loadFoodSelected() {
    await new Promise(resolve => {
        setTimeout(() => {
            loadingSpinner.style.display = 'block';
            resolve();
        }, 1500); // Execute this function 1500ms after the previous function has ended.
    });
}

async function displayFoodSelected() {
    await new Promise(resolve => {
        setTimeout(() => {
            loadingSpinner.style.display = 'none';
            const food = foods[Math.floor(Math.random() * foods.length)];
            foodSelected.innerHTML = `The food that has been selected is: ${food.food}`;
            resolve();
        }, 2000);
    });
}