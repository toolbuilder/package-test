import commandLineUsage from 'command-line-usage'
import log from 'loglevel'
import { optionDefinitions } from './options'

const sections = [
  {
    header: 'Package tester',
    content: 'Generates and tests package'
  },
  {
    header: 'Synopsis',
    content: [
      '$ package-test',
      '$ package-test {bold --src} {underline srcPath} {bold --test} {underline testPath} {bold --glob} {underline glob} {underline pkgDir}',
      '$ package-test {bold --help}'
    ]
  },
  {
    header: 'Options',
    optionList: optionDefinitions
  },
  {
    header: 'Examples',
    content: [
      {
        desc: '1. Interactive ',
        example: '$ package-test'
      }
    ]
  }

]

export const generateHelp = async () => {
  const usage = commandLineUsage(sections)
  log.info(usage)
  return []
}
