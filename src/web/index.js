console.log('...')
var qid = id => document.getElementById(id)

window.onload = function(){
  qid('save').addEventListener('click',function(e){
    console.log(e)
    let text = qid('text').value.trim()
    if(!text) return;
    fetch('/api/addDemo',{
      method:"POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: window.JSON.stringify({text})
    }).then(function(response){
      console.log(response)
    })
  },false)
}