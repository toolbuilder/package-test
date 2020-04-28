import chalk from 'chalk'
import commandLineArgs from 'command-line-args'
import { format } from 'date-fns'
import findUp from 'find-up'
import fs from 'fs-extra'
import log from 'loglevel'
import { homedir, tmpdir } from 'os'
import { join, resolve } from 'path'
import { generateHelp } from './help'
import { runTest } from './index'
import { optionDefinitions } from './options'
import { optionsQueries } from './options-queries'

log.setLevel('info')

const untildify = pathWithTilde => homedir() ? pathWithTilde.replace(/^~(?=$|\/|\\)/, homedir()) : pathWithTilde

const readPackageJson = async (packageDir) => {
  const packageJsonPath = await findUp(join(packageDir, 'package.json'))
  return fs.readJSON(packageJsonPath)
}

const resolvePath = (defaultPath, pathOfSomeSort) => {
  const path = (pathOfSomeSort == null) ? '.' : pathOfSomeSort
  return resolve(defaultPath, path)
}

const displayOptions = (options, optionDefinitions) => {
  for (const defn of optionDefinitions) {
    console.log(`${chalk.yellow(defn.description)} is ${chalk.bold(options[defn.name])}`)
  }
}

const resolveOptionDirectories = (options) => {
  ['src', 'test', 'at'].forEach(name => {
    options[name] = resolvePath(options.dir, untildify(options[name]))
  })
}

const chooseDefaults = (packageJson, options) => {
  if (options.at == null) {
    const prefix = packageJson.name.replace('@', '').replace('/', '-')
    // Curious, NPM can't handle ':' in dates, and formatISO emits colons, but replace doesn't seem them as colons?
    const timePart = format(Date.now(), 'yyyy-MM-dd-kk-mm-ss')
    const tempPath = join(tmpdir(), `${prefix}-${timePart}`)
    options.at = tempPath
  }
  if (options.src == null) options.src = 'src'
  if (options.test == null) options.test = 'test'
  if (options.glob == null) options.glob = '**/*test.js'
}

const main = async () => {
  const options = await commandLineArgs(optionDefinitions, process.argv)
  if (options.help) { await generateHelp(); process.exit(0) }
  if (options.interactive) await optionsQueries(options)
  if (options.dir == null) options.dir = '.'
  options.dir = resolvePath(process.cwd(), untildify(options.dir))
  const packageJson = await readPackageJson(options.dir)
  if (!options.interactive) chooseDefaults(packageJson, options)
  resolveOptionDirectories(options)
  displayOptions(options, optionDefinitions)
  await runTest(packageJson, options)
}

main()
