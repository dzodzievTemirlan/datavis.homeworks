const g = document.querySelector('g');
const circle = document.querySelector('circle');
// let i = 0
// let some_value = 100

const path = document.querySelector('path'); 
const input = document.querySelector('input');

let isTrue = false;

const newValue = "M 150 200 Q 225 300 300 200";
const oldValue = "M 150 200 Q 225 100 300 200";

input.addEventListener('click',()=> {

    isTrue = !isTrue
    console.log(isTrue);
    path.setAttribute("d",isTrue ? newValue : oldValue);
})