$(document).ready(function()
{
  $('#slider1').tinycarousel();
  $('.slider2').tinycarousel();
  $('.slider2').tinycarousel({fullWidth: true}); 
  autoplay();   
  function autoplay() {
    $('.slider2').tinycarousel('next');
    setTimeout(autoplay, 2000);
  }
});