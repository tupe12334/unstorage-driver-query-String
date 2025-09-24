import agentConfig from 'eslint-config-agent'

export default [
  ...agentConfig,
  {
    ignores: ['dist/**', 'node_modules/**']
  }
]