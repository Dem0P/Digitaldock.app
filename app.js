// This is a simple Password Generator App that will generate random password maybe you can you them to secure your account.
// I tried my best to make the code as simple as possible please dont mind the variable names.
// Also this idea came in my mind after checking Traversy Media's latest video.

// Clear the concole on every refresh
const wordListSelect = document.getElementById("word-list");
console.clear();
// set the body to full height
// document.body.style.height = `${innerHeight}px`

// Range Slider Properties.
// Fill : The trailing color that you see when you drag the slider.
// background : Default Range Slider Background
const sliderProps = {
	fill: "#FFF",
	background: "rgba(255, 255, 255, 0.214)",
};

// Selecting the Range Slider container which will effect the LENGTH property of the password.
const slider = document.querySelector(".range__slider");

// Text which will show the value of the range slider.
const sliderValue = document.querySelector(".length__title");

// Using Event Listener to apply the fill and also change the value of the text.
slider.querySelector("input").addEventListener("input", event => {
	sliderValue.setAttribute("data-length", event.target.value);
	applyFill(event.target);
});
// Selecting the range input and passing it in the applyFill func.
applyFill(slider.querySelector("input"));
// This function is responsible to create the trailing color and setting the fill.
function applyFill(slider) {
	const percentage = (100 * (slider.value - slider.min)) / (slider.max - slider.min);
	const bg = `linear-gradient(90deg, ${sliderProps.fill} ${percentage}%, ${sliderProps.background} ${percentage +
			0.1}%)`;
	slider.style.background = bg;
	sliderValue.setAttribute("data-length", slider.value);
}

// Object of all the function names that we will use to create random letters of password
const randomFunc = {
	lower: getRandomLower,
	upper: getRandomUpper,
	number: getRandomNumber,
	symbol: getRandomSymbol,
};

// Random more secure value
function secureMathRandom() {
	return window.crypto.getRandomValues(new Uint32Array(1))[0] / (Math.pow(2, 32) - 1);
}

// Generator Functions
// All the functions that are responsible to return a random value taht we will use to create password.
function getRandomLower() {
	return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
}
function getRandomUpper() {
	return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
}
function getRandomNumber() {
	return String.fromCharCode(Math.floor(secureMathRandom() * 10) + 48);
}
function getRandomSymbol() {
	const symbols = '~!@#$%^&*()_+{}":?><;.,';
	return symbols[Math.floor(Math.random() * symbols.length)];
}

// Selecting all the DOM Elements that are necessary -->

// The Viewbox where the result will be shown
// The input slider, will use to change the length of the password
const lengthEl = document.getElementById("slider");

// Checkboxes representing the options that is responsible to create differnt type of password based on user
const uppercaseEl = document.getElementById("uppercase");
const lowercaseEl = document.getElementById("lowercase");
const numberEl = document.getElementById("number");
const symbolEl = document.getElementById("symbol");

// Button to generate the password
const generateBtn = document.getElementById("generate");
// Button to copy the text
// Result viewbox container
const resultContainer = document.querySelector(".result");
// Text info showed after generate button is clicked
const copyInfo = document.querySelector(".result__info.right");
// Text appear after copy button is clicked
const copiedInfo = document.querySelector(".result__info.left");
const copieddbInfo = document.querySelector(".result__info.dbright");

// if this variable is trye only then the copyBtn will appear, i.e. when the user first click generate the copyBth will interact.
let generatedPassword = false;

// Update Css Props of the COPY button
// Getting the bounds of the result viewbox container
let resultContainerBound = {
	left: resultContainer.getBoundingClientRect().left,
	top: resultContainer.getBoundingClientRect().top,
};
// This will update the position of the copy button based on mouse Position
resultContainer.addEventListener("mousemove", e => {
	resultContainerBound = {
		left: resultContainer.getBoundingClientRect().left,
		top: resultContainer.getBoundingClientRect().top,
	};
	if(generatedPassword){
		copyBtn.style.opacity = '1';
		copyBtn.style.pointerEvents = 'all';
		copyBtn.style.setProperty("--x", `${e.x - resultContainerBound.left}px`);
		copyBtn.style.setProperty("--y", `${e.y - resultContainerBound.top}px`);
	}else{
		copyBtn.style.opacity = '0';
		copyBtn.style.pointerEvents = 'none';
	}
});
window.addEventListener("resize", e => {
	resultContainerBound = {
		left: resultContainer.getBoundingClientRect().left,
		top: resultContainer.getBoundingClientRect().top,
	};
});

const copyBtn = document.getElementById("copy-btn");
const resultEl = document.getElementById("result");

resultEl.addEventListener("click", async () => {
    // Si aucun mot de passe n'a été généré, en générer un
    if (!resultEl.innerText.trim()) {
        const length = +lengthEl.value;
        const hasLower = lowercaseEl.checked;
        const hasUpper = uppercaseEl.checked;
        const hasNumber = numberEl.checked;
        const hasSymbol = symbolEl.checked;

        resultEl.innerText = await generatePassword(length, hasLower, hasUpper, hasNumber, hasSymbol);
		copyInfo.style.transform = "translateY(0%)";
		copyInfo.style.opacity = "0.75";
		copiedInfo.style.transform = "translateY(200%)";
		copiedInfo.style.opacity = "0";
		copieddbInfo.style.transform = "translateY(200%)";
		copieddbInfo.style.opacity = "0";
		return
    }

    // Copier le mot de passe
    const textarea = document.createElement("textarea");
    textarea.value = resultEl.innerText;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);

    // Mettre à jour les informations de copie
    copyInfo.style.transform = "translateY(200%)";
    copyInfo.style.opacity = "0";
    copiedInfo.style.transform = "translateY(0%)";
    copiedInfo.style.opacity = "0.75";
	copieddbInfo.style.transform = "translateY(0%)";
    copieddbInfo.style.opacity = "0.75";
});

resultEl.addEventListener("dblclick", async () => {
    const length = +lengthEl.value;
    const hasLower = lowercaseEl.checked;
    const hasUpper = uppercaseEl.checked;
    const hasNumber = numberEl.checked;
    const hasSymbol = symbolEl.checked;

    resultEl.innerText = await generatePassword(length, hasLower, hasUpper, hasNumber, hasSymbol);
	copyInfo.style.transform = "translateY(0%)";
	copyInfo.style.opacity = "0.75";
	copiedInfo.style.transform = "translateY(200%)";
	copiedInfo.style.opacity = "0";
	copieddbInfo.style.transform = "translateY(200%)";
	copieddbInfo.style.opacity = "0";
});


// Lorsque le bouton Generate est cliqué, le mot de passe est généré.
generateBtn.addEventListener("click", async () => {
	
  // Vérifiez si l'option désactivée est sélectionnée
  if (wordListSelect.value === "") {
    wordListSelect.classList.add("error-border");
    return; // Quittez le gestionnaire d'événements
  } else {
    wordListSelect.classList.remove("error-border");
  }
  
  const length = +lengthEl.value;
  const hasLower = lowercaseEl.checked;
  const hasUpper = uppercaseEl.checked;
  const hasNumber = numberEl.checked;
  const hasSymbol = symbolEl.checked;

  let generatedPassword = await generatePassword(
    length,
    hasLower,
    hasUpper,
    hasNumber,
    hasSymbol
  );

  resultEl.innerText = generatedPassword;
  copyInfo.style.transform = "translateY(0%)";
  copyInfo.style.opacity = "0.75";
  copiedInfo.style.transform = "translateY(200%)";
  copiedInfo.style.opacity = "0";
  copieddbInfo.style.transform = "translateY(200%)";
  copieddbInfo.style.opacity = "0";
});

async function generatePassword(length, hasLower, hasUpper, hasNumber, hasSymbol) {
  const words = await fetchWords(wordListSelect.value);
  let generatedPassword = "";

  while (generatedPassword.length < length) {
    const randomWord = words[Math.floor(Math.random() * words.length)].trim();
    let wordToAdd = randomWord;

    if (hasUpper && hasLower) {
      wordToAdd = wordToAdd.charAt(0).toUpperCase() + wordToAdd.slice(1).toLowerCase();
    } else if (hasUpper) {
      wordToAdd = wordToAdd.toUpperCase();
    }

    generatedPassword += wordToAdd;


    // Ajouter un symbole entre les mots si hasSymbol est actif et s'il y a encore de la place
    if (hasSymbol && generatedPassword.length < length) {
      const symbols = "-_!.@=";
      const randomSymbol = symbols.charAt(Math.floor(Math.random() * symbols.length));
      generatedPassword += randomSymbol;
    }
  }

  // Si le mot de passe généré est trop long, tronquez-le à la longueur souhaitée
  generatedPassword = generatedPassword.substring(0, length);



  // Remplacer les caractères spécifiques par des chiffres si hasNumber est actif
  if (hasNumber) {
    const replacements = {
      'a': '4',
      'A': '4',
      'o': '0',
      'O': '0',
      'e': '3',
      'E': '3'
    };

    const charsToReplace = Object.keys(replacements);
    const numReplacements = Math.min(3, Math.floor(Math.random() * 4) + 1); // Entre 1 et 3 remplacements

    let replacedCount = 0;
    for (let char of charsToReplace) {
      if (replacedCount >= numReplacements) break;
      if (generatedPassword.includes(char)) {
        const regex = new RegExp(char);
        generatedPassword = generatedPassword.replace(regex, replacements[char]);
        replacedCount++;
      }
    }

    // S'assurer qu'au moins un chiffre est présent
    while (!/\d/.test(generatedPassword) && replacedCount < numReplacements) {
      const char = charsToReplace[Math.floor(Math.random() * charsToReplace.length)];
      if (generatedPassword.includes(char)) {
        const regex = new RegExp(char);
        generatedPassword = generatedPassword.replace(regex, replacements[char]);
        replacedCount++;
      }
    }
  }

  return generatedPassword;
}




async function fetchWords(file) {
  const response = await fetch(file);
  const text = await response.text();
  return text.split("\n");
}




// function that handles the checkboxes state, so at least one needs to be selected. The last checkbox will be disabled.
function disableOnlyCheckbox(){
	let totalChecked = [uppercaseEl, lowercaseEl, numberEl, symbolEl].filter(el => el.checked)
	totalChecked.forEach(el => {
		if(totalChecked.length == 1){
			el.disabled = true;
		}else{
			el.disabled = false;
		}
	})
}

[uppercaseEl, lowercaseEl, numberEl, symbolEl].forEach(el => {
	el.addEventListener('click', () => {
		disableOnlyCheckbox()
	})
})