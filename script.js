// Global variables.
const initialContainer = document.querySelector('.initial-container');
const buttonDisplayMainContainer = document.querySelectorAll('.button-display-main-container');
const mainContainer = document.querySelector('.main-container');
const formAddFood = document.querySelector('.form-add-food');
const inputAddFood = document.querySelector('.input-add-food');
const buttonAddFood = document.querySelector('.button-add-food');
const amountOfFoods = document.querySelector('.amount-of-foods');
const listOfFoods = document.querySelector('.list-of-foods');
const actionButtons = document.querySelector('.action-buttons');
const buttonGetFood = document.querySelector('.button-get-food');
const buttonOpenEditFoods = document.querySelector('.button-open-edit-foods');
const foodSelected = document.querySelector('.food-selected');
const loadingSpinner = document.querySelector('.loading-spinner');

const notification = document.querySelector('.notification');

let currentNotification;
let foods = [];
let idFood = 0;

buttonAddFood.disabled = true;

// Event listeners.
buttonDisplayMainContainer.forEach(button => button.addEventListener('click', displayMainContainer));
inputAddFood.addEventListener('input', statusButtonAddFood);
buttonAddFood.addEventListener('click', event => event.preventDefault());
buttonAddFood.addEventListener('click', addFood);
buttonGetFood.addEventListener('click', getFood);
buttonOpenEditFoods.addEventListener('click', openEditFoods);

function displayMainContainer() {
    initialContainer.style.display = 'none';
    mainContainer.style.display = 'block';
}

function statusButtonAddFood() {
    if (inputAddFood.value.length !== 0) {
        buttonAddFood.disabled = false;
    } else {
        buttonAddFood.disabled = true;
    }
}

function addFood() {
    appendFood();
    updateAmountOfFoods();
    updateListOfFoods();
    resetFormAddFood();
    adjustButtonGetFood();
}

function appendFood() {
    const food = inputAddFood.value;
    foods.push({id: idFood, food: food});
    idFood++;
    inputAddFood.focus();
}

function updateAmountOfFoods() {
    if (foods.length === 0) {
        amountOfFoods.innerHTML = `You haven't added any foods.`;
    } else if (foods.length === 1) {
        amountOfFoods.innerHTML = `1 food has been added.`;
    } else {
        amountOfFoods.innerHTML = `${foods.length} foods have been added.`;
    }
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

function resetFormAddFood() {
    inputAddFood.value = '';
    buttonAddFood.disabled = true;
}

function adjustButtonGetFood() {
    if (foods.length === 1) {
        actionButtons.style.display = 'flex';
        amountOfFoods.style.color = '#0E101A';
        buttonGetFood.style.backgroundColor = 'rgba(0, 140, 186, 0.6)';
    } 
    if (foods.length === 2) buttonGetFood.style.backgroundColor = 'rgba(0, 140, 186, 1)';
}

async function getFood() {
    if (foods.length === 1) {
        clearTimeout(currentNotification);
        notification.innerHTML = `Please, add at least one more food to use the 'GET FOOD' button.`;
        notification.classList.add('display-notification');
        currentNotification = setTimeout(() => notification.classList.remove('display-notification'), 4000);
        return;
    }
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


const containerEditFoods = document.querySelector('.container-edit-foods');
const contentEditFoods = document.querySelector('.content-edit-foods');
const editableFoods = document.querySelector('.editable-foods');
const buttonCloseEditFoods = document.querySelector('.button-close-edit-foods');

editableFoods.addEventListener('click', editFoods);
buttonCloseEditFoods.addEventListener('click', closeEditFoods);

function openEditFoods() {
    containerEditFoods.classList.add('display-edit-foods');
    displayEditableFoods();
}

function closeEditFoods() {
    containerEditFoods.classList.remove('display-edit-foods');
    updateAmountOfFoods();
    updateListOfFoods();
}

function displayEditableFoods() {
    while (editableFoods.firstChild) {
        editableFoods.removeChild(editableFoods.firstChild);
    }
    foods.forEach(food => createEditableFoods(food.id, food.food));
    console.log('List of foods:');
    console.log(foods);
}

function createEditableFoods(id, food) {
    const content = `
        <li id="${id}">
            <input type="text" class="input-rename-food" value="${food}">
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
        const foodsUpdated = foods.filter(food => food.id != elementId);
        foods = foodsUpdated;
        displayEditableFoods();
    }
    if (interaction.includes('input-rename-food')) {
        const inputRenameFood = document.querySelectorAll('.input-rename-food');
        for (let i = 0; i < inputRenameFood.length; i++) {
            inputRenameFood[i].addEventListener('input', () => {
                const foodUpdated = event.target.value;
                console.log(foodUpdated);
                foods.find(food => {
                    if (food.id == elementId) food.food = foodUpdated;
                });
            });
        }
    }
}

window.addEventListener('click', event => {
    const element = event.target;
    if (element === containerEditFoods) closeEditFoods();
});