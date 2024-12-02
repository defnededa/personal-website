document.addEventListener("DOMContentLoaded", (event) => {
  console.log("DOM fully loaded and parsed");

  new Vue({
    template: `<div id="app">
             
           <essay-crayola />
          
            </div>`,

    mounted() {},

    data() {},
    el: "#app",
  });
});
