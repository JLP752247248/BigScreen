
// vue.config.js
module.exports = {
        lintOnSave: false,  // 关闭所有 ESLint 校验:ml-citation{ref="2,4" data="citationList"}

  configureWebpack: {
    module: {
      rules: [
        // 配置 TypeScript Loader
        {
          test: /\.tsx?$/,
          loader: 'ts-loader', // 或者使用 'babel-loader' 如果你的目标是 ES5 或更低版本
          options: { appendTsSuffixTo: [/\.vue$/] }, // 如果你在 .vue 文件中使用 TypeScript，需要这个选项
          exclude: /node_modules/, // 排除 node_modules 目录，提高构建速度
        },
        // 配置 Sass Loader
        {
          test: /\.s[ac]ss$/i,
          use: [
            'style-loader',
            'css-loader',
            {
              loader: 'sass-loader',
              options: {
                implementation: require('sass'),
              },
            },
          ],
        }
      ]
    }
  }
}