import { Confirm, Input } from 'enquirer'
import { optionDefinitions } from './options'

const inputPrompt = async (message, initial = '') => {
  const prompt = new Input({ message, initial })
  return prompt.run()
}

const confirmPrompt = async (message) => {
  const prompt = new Confirm({ message })
  return prompt.run()
}

export const optionsQueries = async (options) => {
  for (const defn of optionDefinitions) {
    if (defn.name === 'help' || defn.name === 'quiet') continue
    if (options[defn.name] == null) {
      // TODO: handle defn.multiple === true
      if (defn.type === String) { options[defn.name] = await inputPrompt(`What is ${defn.description}?`, '') }
      if (defn.type === Boolean) { options[defn.name] = await confirmPrompt(`Is this package ${defn.description}?`) }
    }
  }
  return options
}
