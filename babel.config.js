module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset',
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'entry',
        corejs: {
          version: 3,
          proposals: true
        }
      }
    ]
  ],
  plugins: [
    '@babel/syntax-dynamic-import',
    [
      '@babel/plugin-transform-runtime',
      {
        helpers: false,
        regenerator: true
      }
    ],
    '@babel/plugin-transform-async-to-generator'
  ]
}
