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
inputAddFood.addEventListener('input', statusButtonAddFood);
buttonAddFood.addEventListener('click', event => event.preventDefault());
buttonAddFood.addEventListener('click', addFood);
buttonGetFood.addEventListener('click', getFood);
buttonOpenEditFoods.addEventListener('click', openEditFoods);
buttonRetry.addEventListener('click', retry);
buttonResetApplication.addEventListener('click', resetApplication);
editableFoods.addEventListener('click', editFoods);
buttonCloseEditFoods.addEventListener('click', closeEditFoods);
buttonDisplayMainContainer.forEach(button => button.addEventListener('click', () => {
    hideInitialContainer();
    displayMainContainer();
}));

// Enable the usage of the 'buttonAddFood' button only if the user has inserted something in the 'inputAddFood' field.
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

// Whenever the user clicks in the 'buttonGetFood' button, do the following:
// - Check if the user has only added one food. If this is the case, the user will be notified with a message on how to procede.
// - If the user has inserted more than one food:
// '--> First, display all the user's foods in the 'resultContainer'.
// '--> After the previous step is complete, display a loading spinner.
// '--> Once the loading spinner is done, display the food that has been randomly selected.
// All these steps need to happen in an asynchronous way. Therefore, the usage of 'async and await' is necessary.
async function getFood() {
    if (foods.length === 1) return notifyUser();
    hideMainContainer();
    displayResultContainer();
    await shuffleFoods();
    await loadSelectedFood();
    await displaySelectedFood();
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
        }, 1000);
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

// Whenever the user clicks in the 'buttonRetry' button, do the following:
// - Discard the previous result.
// - Do the same process again and display a new result.
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

// Whenever the user clicks in the 'buttonResetApplication' button, do the following:
// - Return to the 'initialContainer'.
// - Clear the 'foods' variable.
// - Reset the 'idFood' variable.
// - Update the information in the 'mainContainer' regarding the user's list.
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

// Reset and then display the foods that have been added to the user's list.
function displayEditableFoods() {
    while (editableFoods.firstChild) {
        editableFoods.removeChild(editableFoods.firstChild);
    }
    foods.forEach(food => createEditableFoods(food.id, food.food));
}

// Assign an input and a button to every food in the user's list.
function createEditableFoods(id, food) {
    const content = `
        <li id="${id}">
            <input type="text" class="input-rename-food" value="${food}">
            <button class="button-delete-food">&times;</button>
        </li>
    `;
    editableFoods.insertAdjacentHTML('beforeend', content);
}

// Foods can be renamed and deleted.
// Whenever the user clicks in a button that has the class 'button-delete-food', do the following:
// - Remove from the 'foods' variable the food that has the same id that is presented in the button's parent element.
// - Update the foods that can be renamed and deleted.
// - If the deleted food was the last one in the 'foods' variable, display a message notifying the user that there are no more foods.
// Whenever the user changes something in an input that has the class 'input-rename-food', do the following:
// - Update the name of the food in the 'foods' variable that has the same id that is presented in the input's parent element.
function editFoods(event) {
    const element = event.target;
    const elementId = element.parentElement.id;
    const interaction = JSON.stringify(element.classList);
    if (interaction.includes('button-delete-food')) {
        const foodsUpdated = foods.filter(food => food.id != elementId);
        foods = foodsUpdated;
        displayEditableFoods();
        verifyAmountOfFoods();
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

function verifyAmountOfFoods() {
    if (foods.length === 0) {
        const content = `
            <p style="font-size: 0.9em; text-align: center;">
                Your list of foods is currently empty.
            </p>
        `;
        editableFoods.insertAdjacentHTML('beforeend', content);
    }
}

// Whenever the user closes the 'containerEditFoods', do the following:
// - Display the updated number of foods that are in the user's list.
// - Display the updated name of the foods that are in the user's list.
// - Update the status of the 'buttonGetFood' button.
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