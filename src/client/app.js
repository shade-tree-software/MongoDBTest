let getWidget = function () {
  let value = Math.random()
  fetch(`/widgets?value=${value}`, {method: 'put'}).then(function () {
    fetch('/widgets').then(function(response){
      return response.json()
    }).then(function(data){
      console.log(value, data.value)
    })
  })
}

setInterval(getWidget, 5000)