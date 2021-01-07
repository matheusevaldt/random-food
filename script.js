// Global variables.
const initialContainer = document.querySelector('.initial-container');
const buttonDisplayMainContainer = document.querySelectorAll('.button-display-main-container');
const mainContainer = document.querySelector('.main-container');
const formAddFood = document.querySelector('.form-add-food');
const inputAddFood = document.querySelector('.input-add-food');
const buttonAddFood = document.querySelector('.button-add-food');
const amountOfFoods = document.querySelector('.amount-of-foods');
const listOfFoods = document.querySelector('.list-of-foods');
const mainButtons = document.querySelector('.main-buttons');
const buttonGetFood = document.querySelector('.button-get-food');
const buttonOpenEditFoods = document.querySelector('.button-open-edit-foods');
const resultContainer = document.querySelector('.result-container');
const resultNumberStep = document.querySelector('.result-number-step');
const resultCurrentStep = document.querySelector('.result-current-step');
const selectableFoods = document.querySelector('.selectable-foods');
const loadingFood = document.querySelector('.loading-food');
const selectedFood = document.querySelector('.selected-food');
const outcome = document.querySelector('.outcome');
const resultButtons = document.querySelector('.result-buttons');
const buttonRetry = document.querySelector('.button-retry');
const buttonResetApplication = document.querySelector('.button-reset-application');
const containerEditFoods = document.querySelector('.container-edit-foods');
const contentEditFoods = document.querySelector('.content-edit-foods');
const editableFoods = document.querySelector('.editable-foods');
const buttonCloseEditFoods = document.querySelector('.button-close-edit-foods');
const notification = document.querySelector('.notification');

let currentNotification;
let foods = [];
let idFood = 0;

buttonAddFood.disabled = true;

// Event listeners.
buttonDisplayMainContainer.forEach(button => button.addEventListener('click', () => {
    hideInitialContainer();
    displayMainContainer();
}));
inputAddFood.addEventListener('input', statusButtonAddFood);
buttonAddFood.addEventListener('click', event => event.preventDefault());
buttonAddFood.addEventListener('click', addFood);
buttonGetFood.addEventListener('click', getFood);
buttonOpenEditFoods.addEventListener('click', openEditFoods);
buttonRetry.addEventListener('click', retry);
buttonResetApplication.addEventListener('click', resetApplication);
editableFoods.addEventListener('click', editFoods);
buttonCloseEditFoods.addEventListener('click', closeEditFoods);

// Enable the usage of the button 'buttonAddFood' only if user has inserted something in the 'inputAddFood' field.
function statusButtonAddFood() {
    if (inputAddFood.value.length !== 0) {
        buttonAddFood.disabled = false;
    } else {
        buttonAddFood.disabled = true;
    }
}

// Whenever the user inserts a new food, do the following:
// - Store the food's name and its id in the 'foods' variable.
// - Update the amount of foods that the user has added.
// - Update and display the list of foods that the user has added.
// - If more than 1 food has been add, enable the usage of the 'buttonGetFood' button.
function addFood() {
    appendFood();
    updateAmountOfFoods();
    displayListOfFoods();
    updateListOfFoods();
    resetFormAddFood();
    statusButtonGetFood();
}

function appendFood() {
    let food = inputAddFood.value;
    foods.push({id: idFood, food: food});
    idFood++;
    inputAddFood.focus();
}

function updateAmountOfFoods() {
    if (foods.length === 0) {
        amountOfFoods.innerHTML = `You haven't added any foods.`;
    } else if (foods.length === 1) {
        amountOfFoods.innerHTML = '1 food has been added.';
    } else {
        amountOfFoods.innerHTML = `${foods.length} foods have been added.`;
    }
}

function displayListOfFoods() {
    if (foods.length === 1) {
        listOfFoods.style.display = 'block';
    }
}

function updateListOfFoods() {
    resetListOfFoods();
    foods.map((name, index) => {
        const li = document.createElement('li');
        const food = `<strong>${name.food}</strong>`;
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

function statusButtonGetFood() {
    if (foods.length === 0) {
        mainButtons.style.display = 'none';
    }
    if (foods.length === 1) {
        mainButtons.style.display = 'flex';
        amountOfFoods.style.color = '#0E101A';
        buttonGetFood.style.backgroundColor = 'rgba(159, 95, 128, 0.6)';
        buttonGetFood.style.cursor = 'not-allowed';
    } 
    if (foods.length === 2) {
        buttonGetFood.style.backgroundColor = 'rgba(159, 95, 128, 1)';
        buttonGetFood.style.cursor = 'pointer';
    }
}

// 
async function getFood() {
    if (foods.length === 1) return notifyUser();
    hideMainContainer();
    displayResultContainer();
    await shuffleFoods();
    await loadSelectedFood();
    await displaySelectedFood(2000);
}

function notifyUser() {
    clearTimeout(currentNotification);
    notification.innerHTML = 'You must add at least two foods to use the <strong>GET FOOD</strong> functionality.';
    notification.classList.add('display-notification');
    currentNotification = setTimeout(() => notification.classList.remove('display-notification'), 4000);
}

async function shuffleFoods() {
    await new Promise(resolve => {
        for (let i = 0; i < foods.length; i++) {
            setTimeout(() => {
                console.log(foods[i].food);
                resultNumberStep.innerHTML = '[1/3]'
                resultCurrentStep.innerHTML = 'Shuffling your foods...';
                selectableFoods.style.display = 'block';
                selectableFoods.innerHTML = foods[i].food;
                selectableFoods.classList.add('display-selectable-food');
                setTimeout(() => selectableFoods.classList.remove('display-selectable-food'), 950);
                if (i === foods.length - 1) resolve();
            }, i * 1000);
        }
    });
}

async function loadSelectedFood() {
    await new Promise(resolve => {
        setTimeout(() => {
            resultNumberStep.innerHTML = '[2/3]';
            resultCurrentStep.innerHTML = 'Getting your food...';
            selectableFoods.style.display = 'none';
            loadingFood.style.display = 'block';
            resolve();
        }, 1000); // Execute this function X ms after the previous function has ended.
    });
}

async function displaySelectedFood() {
    await new Promise(resolve => {
        setTimeout(() => {
            resultNumberStep.innerHTML = '[3/3]';
            resultCurrentStep.innerHTML = `Here's your food. <span>&#9996;</span>`;
            loadingFood.style.display = 'none';
            selectedFood.style.display = 'block';
            const food = foods[Math.floor(Math.random() * foods.length)];
            setTimeout(() => {
                outcome.classList.add('display-outcome');
                outcome.innerHTML = `${food.food}`;
            }, 1000);
            setTimeout(() => resultButtons.classList.add('display-result-buttons'), 3000);
            resolve();
        }, 2000);
    });
}

async function retry() {
    resetResultContainer();
    await shuffleFoods();
    await loadSelectedFood();
    await displaySelectedFood();
}

function resetResultContainer() {
    selectedFood.style.display = 'none';
    outcome.classList.remove('display-outcome');
    resultButtons.classList.remove('display-result-buttons');
    selectableFoods.classList.remove('display-selectable-food');
}

function resetApplication() {
    resetResultContainer();
    hideResultContainer();
    displayInitialContainer();
    foods = [];
    idFood = 0;
    updateAmountOfFoods();
    updateListOfFoods();
    statusButtonGetFood();
}

function openEditFoods() {
    containerEditFoods.classList.add('display-edit-foods');
    displayEditableFoods();
}

function displayEditableFoods() {
    while (editableFoods.firstChild) {
        editableFoods.removeChild(editableFoods.firstChild);
    }
    foods.forEach(food => createEditableFoods(food.id, food.food));
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
                foods.find(food => {
                    if (food.id == elementId) food.food = foodUpdated;
                });
            });
        }
    }
}

function closeEditFoods() {
    containerEditFoods.classList.remove('display-edit-foods');
    updateAmountOfFoods();
    updateListOfFoods();
    statusButtonGetFood();
}

window.addEventListener('click', event => {
    const element = event.target;
    if (element === containerEditFoods) closeEditFoods();
});

function displayInitialContainer() {
    initialContainer.style.display = 'block';
}

function hideInitialContainer() {
    initialContainer.style.display = 'none';
}

function displayMainContainer() {
    mainContainer.style.display = 'block';
}

function hideMainContainer() {
    mainContainer.style.display = 'none';
}

function displayResultContainer() {
    resultContainer.style.display = 'block';
}

function hideResultContainer() {
    resultContainer.style.display = 'none';
}