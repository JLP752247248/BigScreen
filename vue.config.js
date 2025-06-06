const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  css: {
    loaderOptions: {
      scss: {
        prependData: `@import "vue3-sketch-ruler/lib/style.css";`,
      }
    }
  }
});
