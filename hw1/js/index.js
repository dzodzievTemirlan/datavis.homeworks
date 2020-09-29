const g = document.querySelector('g');
const circle = document.querySelector('circle');
// let i = 0
// let some_value = 100

const path = document.querySelector('path'); 
const input = document.querySelector('input');
const mood = document.getElementById('mood')

let isTrue = false;

const newValue = "M 150 200 Q 225 300 300 200";
const oldValue = "M 150 200 Q 225 100 300 200";
const newMood = "Happy"
const oldMood = "Sad"

input.addEventListener('click',()=> {

    isTrue = !isTrue
    console.log(isTrue);
    path.setAttribute("d",isTrue ? newValue : oldValue);
    if (isTrue === true) {
        mood.innerHTML = newMood
    } else {
        mood.innerHTML = oldMood
    }
})