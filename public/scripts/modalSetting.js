document.getElementById("auth").addEventListener("click", () => {
    document.querySelector(".bg-modal").style.display = "flex";
});

document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".bg-modal").style.display = "none";
});

document.getElementById("outside").addEventListener("click", (e) => {
  if(e.target.className == "bg-modal sticky-top") {
    // e.preventDefault();
     document.querySelector(".bg-modal").style.display = "none";
  }
  // else{
  //
  // }
});
//
// window.onclick = function (event) {
//   if (document.querySelector(".bg-modal").style.display === "flex") {
//     var modalContent = modal.querySelector(".modal-content");
//     if (!modalContent.contains(event.target)) {
//       document.querySelector(".bg-modal").style.display = "none";
//     }
//   }
// };
