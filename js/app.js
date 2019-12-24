console.log('here')
$(function () {
  // Fill in your firebase project's information below:

  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyABMAEWHJms5QHYgq915xWRgcLNTkZHyoQ",
    authDomain: "lunchbox-acd.firebaseapp.com",
    databaseURL: "https://lunchbox-acd.firebaseio.com",
    projectId: "lunchbox-acd",
    storageBucket: "lunchbox-acd.appspot.com",
    messagingSenderId: "151181776169",
    appId: "1:151181776169:web:5652e0e7c8e82759199338"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  const dbRecipes = firebase.firestore().collection('recipes')
  console.log(dbRecipes)

  // ------**CREATE**---------

  // listen for submit event on Add New Recipe form
  $('#recipe-form').submit((event) => {
    event.preventDefault()
    console.log($('#recipe-title').val())
    console.log($('#ingredients').val())
    console.log($('#steps').val())
    // const newRecipeName = $('#recipe-title').val()
    // const newIngredients = $('#ingredients').val()
    // const newSteps = $('#steps').val()

    // firebase API call to create new recipes

    dbRecipes.add({
      recipeTitle: $('#recipe-title').val(),
      ingredients: $('#ingredients').val(),
      steps: $('#steps').val(),

    })
    .then((response) => {
      console.log(response)
    })
    .catch((error) => {
      console.log(error)
    })

    clearAddFormFields()
  })

  // -------- **READ** ---------
    // listen for changes to our songs collection
    dbRecipes.onSnapshot((snapshot) => {
      console.log(snapshot)

      $('.recipes').html('')

      snapshot.forEach((recipe) => {
        console.log(recipe.id)
        console.log(recipe.data())
        const recipeId = recipe.id
        const recipeName = recipe.data().recipeTitle
        const recipeIng = recipe.data().ingredients
        const recipeSteps = recipe.data().steps

        console.log(recipeId)
        console.log(recipeName)
        console.log(recipeIng)
        console.log(recipeSteps)

        const recipeItemHtml = buildRecipeItemHtml(recipeName, recipeIng, recipeSteps)
        console.log(recipeItemHtml)
        const recipeHtml = (
          `<div class="recipe" id="${recipeId}">
              ${recipeItemHtml}
            </div>
          `
        )

        $('.recipes').append(recipeHtml)

        console.log(recipeHtml)
      })


})
// -------- **UPDATE** ---------

// listen for click event on the "edit" button
$('body').on('click', 'button.edit-recipe', (event) => {
  const selectedRecipeId = $(event.currentTarget).parent().parent().attr('id')
  console.log(selectedRecipeId)

  // Firebase API - fetch the entire recipe document associated with the
  // selectedRecipeId

  dbRecipes.doc(selectedRecipeId).get().then((recipe) => {
    const selectedRecipeName = recipe.data().recipeTitle
    const selectedIngred = recipe.data().ingredients
    const selectedSteps = recipe.data().steps

    console.log(selectedRecipeId)
    console.log(selectedRecipeName)
    console.log(selectedIngred)
    console.log(selectedSteps)

    const formHtml = buildEditFormHtml(selectedRecipeId, selectedRecipeName, selectedIngred, selectedSteps)

    $(event.currentTarget).parent().parent().html(formHtml)
  }).catch((error) => {
    console.log('Error getting document:', error)
  })
})

// listen for click event on the "cancel" (edit) link
$('body').on('click', '.recipe .cancel-edit', (event) => {
  const recipeId = $(event.currentTarget).parent().find('#recipe-id').val()
  const recipeName = $(event.currentTarget).parent().find('#update-recipe-name').val()
  const recipeIng = $(event.currentTarget).parent().find('#update-ingredients').val()
  const recipeSteps = $(event.currentTarget).parent().find('#update-steps').val()

  console.log(recipeId)
  console.log(recipeName)
  console.log(recipeIng)
  console.log(recipeSteps)

  const recipeItemHtml = buildRecipeItemHtml(recipeName, recipeIng, recipeSteps)

  $(event.currentTarget).parent().parent().html(recipeItemHtml)
})

// listen for the submit event for update song form
$('body').on('submit', '#update-recipe-form', (event) => {
  event.preventDefault()

  const recipeId = $(event.currentTarget).parent().find('#recipe-id').val()
  const updatedRecipeName = $(event.currentTarget).parent().find('#update-recipe-name').val()
  const updatedIngred = $(event.currentTarget).parent().find('#update-ingredients').val()
  const updatedSteps = $(event.currentTarget).parent().find('#update-steps').val()

  console.log(recipeId)
  console.log(updatedRecipeName)
  console.log(updatedIngred)
  console.log(updatedSteps)

  // Firebase API - update song using its ID
  dbRecipes.doc(recipeId).update({
    recipeTitle: updatedRecipeName,
    ingredients: updatedIngred,
    steps: updatedSteps
  })
})

// -------- **DELETE** ---------

// listen for click event on the "delete" button
$('body').on('click', 'button.delete-recipe', (event) => {
  const recipeId = $(event.currentTarget).parent().parent().attr('id')
  console.log(recipeId)

  // Firebase API - remove recipe from database using it's ID
  dbRecipes.doc(recipeId).delete()

})

// ------ Display Modal Logic -------
// listen for click event on the "details" button any of the song items in list
$('body').on('click', 'button.see-full-recipe', (event) => {
  console.log('clicked on details button')
  // grab Id of the selected song so we can query firebase for the
  // entire song document
  const selectedRecipeId = $(event.currentTarget).parent().parent().attr('id')

  // Firebase API - fetch the entire recipe document associated with the
  // selectedRecipeId

  dbRecipes.doc(selectedRecipeId).get().then((recipe) => {
    const selectedRecipeName = recipe.data().recipeTitle
    const selectedIngred = recipe.data().ingredients
    const selectedSteps = recipe.data().steps

    console.log(selectedRecipeName)
    console.log(selectedIngred)
    console.log(selectedSteps)

    // Use jquery to update the Model with details of selected song
    $('#recipe-modal .recipe-title').text(selectedRecipeName)
    $('#recipe-modal .ingredients').text(selectedIngred)
    $('#recipe-modal .steps').text(selectedSteps)
    // open the modal
    $('#recipe-modal').modal()
  }).catch((error) => {
    console.log('Error getting document:', error)
  })
})

// -------- Utility Functions ---------


function buildRecipeItemHtml (recipeTitle) {
  return (
`<div class="recipe-name">${recipeTitle}</div>
  <div class="actions">
    <button class="edit-recipe">edit</a>
    <button class="delete-recipe">delete</a>
    <button class="see-full-recipe">see full recipe</a>
  </div>`
)
}

  // html template for Edit Song Form
  function buildEditFormHtml (recipeId, recipeName, recipeIng, recipeSteps) {
    return (
      `
        <form id="update-recipe-form">
          <p>Update Recipe</p>
          <input type="text" id="update-recipe-name" value="${recipeName}"/>
          <input type="text" id="update-ingredients" value="${recipeIng}"/>
          <input type="text" id="update-steps" value="${recipeSteps}"/>
          <input type="hidden" id="recipe-id" value="${recipeId}"/>
          <button>Update</button>
          <a href="" class="cancel-edit"> cancel </a>
        </form>
      `
    )
  }

  // Clear text fields on Add New Song form
  function clearAddFormFields () {
    $('#recipe-title').val('')
    $('#ingredients').val('')
    $('#steps').val('')
  }

})
