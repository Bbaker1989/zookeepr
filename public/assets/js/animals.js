const { response } = require("express");

const $animalForm = document.querySelector('#animals-form');
const $displayArea = document.querySelector('#display-area');

const printResults = resultArr => {
  console.log(resultArr);

  const animalHTML = resultArr.map(({ id, name, personalityTraits, species, diet }) => {
    return `
  <div class="col-12 col-md-5 mb-3">
    <div class="card p-3" data-id=${id}>
      <h4 class="text-primary">${name}</h4>
      <p>Species: ${species.substring(0, 1).toUpperCase() + species.substring(1)}<br/>
      Diet: ${diet.substring(0, 1).toUpperCase() + diet.substring(1)}<br/>
      Personality Traits: ${personalityTraits
        .map(trait => `${trait.substring(0, 1).toUpperCase() + trait.substring(1)}`)
        .join(', ')}</p>
    </div>
  </div>
    `;
  });

  $displayArea.innerHTML = animalHTML.join('');
};

const getAnimals = (formData = {}) => {  //infor from handleGetAnimalsSubmit returned as formData
  let queryUrl = '/api/animals?';

  Object.entries(formData).forEach(([key, value]) => { //creates query parameters
    queryUrl += `${key}=${value}&`;
  });

  console.log(queryUrl);

//make request using queryUrl
fetch(queryUrl)
  .then(response => {
    if (!response.ok) {  //check if ok property is true or false (checks for HTTP status codes of error)
      return alert('Error: ' + response.statusText);  //error -> alert user something is wrong
    }
    return response.json(); // no errors -> .json method to parse response into readable JSON format
  })
  .then(animalData => {
    console.log(animalData);
    printResults(animalData);
  });


};

const handleGetAnimalsSubmit = event => { //form submission
  event.preventDefault();
  const dietRadioHTML = $animalForm.querySelectorAll('[name="diet"]');
  let diet;

  for (let i = 0; i < dietRadioHTML.length; i += 1) {
    if (dietRadioHTML[i].checked) {
      diet = dietRadioHTML[i].value;
    }
  }

  if (diet === undefined) {
    diet = '';
  }

  const personalityTraitArr = [];
  const selectedTraits = $animalForm.querySelector('[name="personality"').selectedOptions;

  for (let i = 0; i < selectedTraits.length; i += 1) {
    personalityTraitArr.push(selectedTraits[i].value);
  }

  const personalityTraits = personalityTraitArr.join(',');

  const animalObject = { diet, personalityTraits };

  getAnimals(animalObject);
};

$animalForm.addEventListener('submit', handleGetAnimalsSubmit);

getAnimals();
