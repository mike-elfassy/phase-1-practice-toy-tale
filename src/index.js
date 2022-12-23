// Initialize Add new toy Button
let addToy = false;
const toyFormContainer = document.querySelector(".container")
const addBtn = document.querySelector("#new-toy-btn");

addBtn.addEventListener("click", toggleAddToy)

const toyForm = document.querySelector('body form.add-toy-form')
toyForm.addEventListener('submit', (event) => {
  event.preventDefault()
  inputName = event.target.querySelector('[name="name"]').value
  inputImg = event.target.querySelector('[name="image"]').value
  postToy(inputName, inputImg)
})

// API Calls

// Fetch all toys
fetch(`http://localhost:3000/toys`)
  .then(response => response.json())
  .then(data => data.forEach(addToyCardtoDom))

// Post new toy
function postToy(name, image) {
  fetch('http://localhost:3000/toys', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify({
          'name': name,
          'image': image,
          'likes': 0
        })
    })
    .then(response => response.json())
    .then(object => {
      addToyCardtoDom(object)
      toyForm.reset()
      toggleAddToy()
      alert(`New toy added: ${object.name}`)
    })
    .catch(error => alert(error.message))
}

// Add likes
function addLike(id) {
  // Get latest like
  fetch(`http://localhost:3000/toys/${id}`)
    .then(response => response.json())
    .then(toy => {
      // Update like count on server
      fetch(`http://localhost:3000/toys/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify({
              'likes': ++toy.likes
            })
        })
        .then(response => response.json())
        .then(toy => {
          // Update like count on DOM
          let updatedToyCard = document.querySelector(`body div#toy-collection div.card button[id='${toy.id}']`).parentNode
          updatedToyCard.querySelector('p').textContent = `${toy.likes} Likes`
        })
        .catch(error => alert(error.message))
    })
}

// Helper functions
function addToyCardtoDom(toyObject) {
  let toyCard = document.createElement('div')
  toyCard.className = 'card'
  toyCard.innerHTML =
  `
      <h2>${toyObject.name}</h2>
      <img src="${toyObject.image}" class="toy-avatar" />
      <p>${toyObject.likes} Likes</p>
      <button class="like-btn" id="${toyObject.id}">Like ❤️</button>
  `

  toyCard.querySelector('button').addEventListener('click',(event) => addLike(event.target.id))
  //Add card to DOM
  document.querySelector('body div#toy-collection').appendChild(toyCard)
  
}

function toggleAddToy() {
  addToy = !addToy;
  if (addToy) {
    toyFormContainer.style.display = "block";
  } else {
    toyFormContainer.style.display = "none";
  }
}