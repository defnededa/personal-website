/**
 * Starter code
 *
 */
/* globals Vue, p5 */
// GLOBAL VALUES, CHANGE IF YOU WANT

// TODO: this currently has an essay about Pokemon data.
// You will use your own data so clear out any pokemon stuff!

document.addEventListener("DOMContentLoaded", (event) => {
  console.log("DOM fully loaded and parsed");

  new Vue({
    template: `<div id="app">
           
         <essay-crayola />
        
          </div>`,

    mounted() {},

    data() {
      // Load your data here!
      // LOAD SOME DATA FROM THE ART INSTITUTE
      // var artURL = "https://api.artic.edu/api/v1/artworks/search?q=cats"
      //   fetch(artURL).then((response) => {
      //     return response.json()
      //   }).then((data) => {
      //     console.log("data", data)
      // this.art = data
      //   })
    },
    el: "#app",
  });
});
