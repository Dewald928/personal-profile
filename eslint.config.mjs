import nextVitals from 'eslint-config-next/core-web-vitals'

const config = [
  ...nextVitals,
  { ignores: ['.superpowers/**', '.gstack/**', '.cursor/**'] },
]

export default config
