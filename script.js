const inputAddFood = document.querySelector('.input-add-food');
const buttonAddFood = document.querySelector('.button-add-food');
const amountOfFoods = document.querySelector('.amount-of-foods');
const listOfFoods = document.querySelector('.list-of-foods');

let foods = [];
let idFood = 0;

buttonAddFood.disabled = true;

inputAddFood.addEventListener('input', statusButtonAddFood);
buttonAddFood.addEventListener('click', event => event.preventDefault());
buttonAddFood.addEventListener('click', addFood);

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
}

function updateAmountOfFoods() {
    const amount = foods.length === 1 ? 'food' : 'foods';
    amountOfFoods.innerHTML = `You have added ${foods.length} ${amount} so far.`;
}

function updateListOfFoods() {
    resetListOfFoods();
    foods.map((food, index) => {
        const nameOfTheFood = document.createElement('li');
        const period = foods.length - 1 === index ? '.' : ''
        if (index === 0) {
            nameOfTheFood.innerHTML = `${food.food}${period}`;
        } else {
            nameOfTheFood.innerHTML = `, ${food.food}${period}`;
        }
        listOfFoods.appendChild(nameOfTheFood);
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