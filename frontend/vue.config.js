module.exports = {
    configureWebpack: {
        module: {
            rules: [
              // ... other rules omitted
        
              // this will apply to both plain `.scss` files
              // AND `<style lang="scss">` blocks in `.vue` files
              {
                test: /\.scss$/,
                use: [
                  'sass-loader'
                ]
              }
            ]
          },
    }
  }