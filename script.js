const buttonDisplayAddFood = document.querySelector('.button-display-add-food');
const formAddFood = document.querySelector('.form-add-food');
const inputAddFood = document.querySelector('.input-add-food');
const buttonAddFood = document.querySelector('.button-add-food');
const amountOfFoods = document.querySelector('.amount-of-foods');
const listOfFoods = document.querySelector('.list-of-foods');
const buttonGetFood = document.querySelector('.button-get-food');
const buttonOpenEditFoods = document.querySelector('.button-open-edit-foods');
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
buttonOpenEditFoods.addEventListener('click', openEditFoods);

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


const wrapperEditFoods = document.querySelector('.wrapper-edit-foods');
const contentEditFoods = document.querySelector('.content-edit-foods');
const editableFoods = document.querySelector('.editable-foods');
const buttonCloseEditFoods = document.querySelector('.button-close-edit-foods');

editableFoods.addEventListener('click', editFoods);
buttonCloseEditFoods.addEventListener('click', closeEditFoods);

function openEditFoods() {
    wrapperEditFoods.classList.add('display-edit-foods');
    displayEditableFoods();
}

function closeEditFoods() {
    wrapperEditFoods.classList.remove('display-edit-foods');
    updateAmountOfFoods();
    updateListOfFoods();
}

function displayEditableFoods() {
    while (editableFoods.firstChild) editableFoods.removeChild(editableFoods.firstChild);
    foods.forEach(food => createEditableFoods(food.id, food.food));
    console.log(foods);
}

function createEditableFoods(id, food) {
    console.log(food);
    const content = `
    <li id="${id}">
        <input type="text" class="input-rename-food" value="${food}" >
        <button class="button-delete-food">&times;</button>
    </li>
    `;
    editableFoods.insertAdjacentHTML('beforeend', content);
}

function editFoods(event) {
    const element = event.target;
    const elementId = element.parentElement.id;
    const interaction = JSON.stringify(element.classList);
    if (interaction.includes('button-delete-food')) {
        foods.splice(elementId, 1);
        displayEditableFoods();
    }
    if (interaction.includes('input-rename-food')) {
        const inputRenameFood = document.querySelectorAll('.input-rename-food');
        for (let i = 0; i < inputRenameFood.length; i++) {
            inputRenameFood[i].addEventListener('input', () => {
                const newValue = event.target.value;
                console.log(newValue);
                foods.find(food => {
                    if (food.id == elementId) food.food = newValue;
                });
            });
        }
    }
}

window.addEventListener('click', event => {
    const element = event.target;
    const interaction = JSON.stringify(element.classList);
    const isMobileDevice = window.navigator.userAgent.toLowerCase().includes('mobi');
    if (isMobileDevice) {
        if (interaction.includes('input-rename-food')) {
            buttonCloseEditFoods.style.display = 'none';
            contentEditFoods.style.height = '100vh';
        } else {
            buttonCloseEditFoods.style.display = 'block';
            contentEditFoods.style.height = '80vh';
        }
    }
});