module.exports = {
  presets: [
    '@vue/app',
    [
      "@babel/preset-env",
      {
        "useBuiltIns": "entry"
      }
    ]
  ],
  plugins: ['syntax-dynamic-import']
}
