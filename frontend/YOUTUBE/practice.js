var menu = document.querySelector(".menu");
var sidebar = document.querySelector(".side-bar");
var video  = document.querySelector(".video");

menu.onclick = function(){
    sidebar.classList.toggle("small-side-bar");
    video.classList.toggle("large-video");  /* toggle we use when we want to play between the two classes of the           */
}