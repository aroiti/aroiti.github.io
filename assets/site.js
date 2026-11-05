// Mémorise la langue choisie et anime le verrou de l'Oracle.
document.querySelectorAll('[data-langue]').forEach(function(a){
  a.addEventListener('click',function(){try{localStorage.setItem('langue',a.dataset.langue)}catch(e){}});
});
var v=document.querySelector('.verrou'),e=document.querySelector('.etat'),t=document.getElementById('ferme');
if(v){v.addEventListener('click',function(){
  e.textContent=t.content.textContent;
  v.classList.remove('refus');void v.offsetWidth;v.classList.add('refus');
});}
