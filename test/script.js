var div = document.createElement('div')
div.id = 'id'
div.style.color = 'red'
div.removeAttribute('style')
div.innerText = 'js-tracker'
div.addEventListener('click', function () {
  console.log('clicked')
})
