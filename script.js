const display = document.getElementById("display");
const historyList = document.getElementById("historyList");

let expression = "";

// Load History
let history = JSON.parse(localStorage.getItem("sakHistory")) || [];
renderHistory();

document.querySelectorAll("button").forEach(button => {

    button.addEventListener("click", () => {

        const value = button.dataset.value;

        if (button.classList.contains("equal")) {
            calculate();
            return;
        }

        if (value === "C") {
            clearDisplay();
            return;
        }

        if (value === "DEL") {
            deleteLast();
            return;
        }

        appendValue(value);

    });

});

function appendValue(value) {

    expression += value;
    display.value = expression;

}

function clearDisplay() {

    expression = "";
    display.value = "";

}

function deleteLast() {

    expression = expression.slice(0, -1);
    display.value = expression;

}

function calculate() {

    if (expression === "") return;

    try {

        let result = eval(expression);

        if (!isFinite(result)) throw "Error";

        saveHistory(expression, result);

        display.value = result;

        expression = result.toString();

        pulseDisplay();

    }

    catch {

        display.value = "Error";

        expression = "";

        shake();

    }

}

function pulseDisplay() {

    display.animate([
        {transform:"scale(1)"},
        {transform:"scale(1.05)"},
        {transform:"scale(1)"}
    ],{
        duration:300
    });

}

function shake(){

    document.querySelector(".calculator").animate([
        {transform:"translateX(0px)"},
        {transform:"translateX(-10px)"},
        {transform:"translateX(10px)"},
        {transform:"translateX(-10px)"},
        {transform:"translateX(0px)"}
    ],{
        duration:300
    });

}

function saveHistory(exp,res){

    history.unshift(`${exp} = ${res}`);

    if(history.length>20)
        history.pop();

    localStorage.setItem("sakHistory",JSON.stringify(history));

    renderHistory();

}

function renderHistory(){

    historyList.innerHTML="";

    history.forEach(item=>{

        const li=document.createElement("li");

        li.textContent=item;

        li.onclick=()=>{

            const answer=item.split("=")[1].trim();

            expression=answer;

            display.value=answer;

        };

        historyList.appendChild(li);

    });

}

// Keyboard Support

document.addEventListener("keydown",(e)=>{

    const key=e.key;

    if("0123456789+-*/.%".includes(key)){

        appendValue(key);

    }

    else if(key==="Enter"){

        e.preventDefault();

        calculate();

    }

    else if(key==="Backspace"){

        deleteLast();

    }

    else if(key==="Delete"){

        clearDisplay();

    }

    else if(key==="Escape"){

        clearDisplay();

    }

});

// Glow Effect

setInterval(()=>{

document.querySelector(".calculator").style.boxShadow=
`0 0 ${20+Math.random()*20}px rgba(0,255,255,.4)`;

},800);

// Welcome Animation

window.onload=()=>{

document.querySelector(".calculator").animate([
{opacity:0,transform:"scale(.7)"},
{opacity:1,transform:"scale(1)"}
],{
duration:800,
fill:"forwards"
});

};
