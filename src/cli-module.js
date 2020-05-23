import chalk from 'chalk'
import commandLineArgs from 'command-line-args'
import cuid from 'cuid'
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

const untildify = pathWithTilde => homedir() ? pathWithTilde.replace(/^~(?=$|\/|\\)/, homedir()) : pathWithTilde

const readPackageJson = async (packageDir) => {
  const searchStart = join(packageDir, 'package.json')
  const packageJsonPath = await findUp(searchStart, { type: 'file', allowSymlinks: true })
  if (packageJsonPath == null) throw new Error(`Could not find package.json at or above ${searchStart}`)
  return fs.readJSON(packageJsonPath)
}

const resolvePath = (defaultPath, pathOfSomeSort) => {
  const path = (pathOfSomeSort == null) ? '.' : pathOfSomeSort
  return resolve(defaultPath, path)
}

const displayOptions = (options, optionDefinitions) => {
  for (const defn of optionDefinitions) {
    log.debug(`${chalk.yellow(defn.description)} is ${chalk.bold(options[defn.name])}`)
  }
}

const resolveOptionDirectories = (options) => {
  ['src', 'test', 'at'].forEach(name => {
    options[name] = resolvePath(options.dir, untildify(options[name]))
  })
}

const makeTempPath = (prefix) => {
  // formatISO emits colons for the time part, which can be problematic on command lines as NPM parameters
  const timePart = format(Date.now(), 'yyyy-MM-dd-kk-mm')
  return join(tmpdir(), `${prefix}-${timePart}-${cuid.slug()}`) // slug provides uniqueness in same minute
}

const chooseDefaults = (packageJson, options) => {
  if (options.at == null) {
    const prefix = packageJson.name.replace('@', '').replace('/', '-')
    options.at = makeTempPath(prefix)
  }
  if (options.src == null) options.src = 'src'
  if (options.test == null) options.test = 'test'
  if (options.glob == null) options.glob = '**/*test.js'
}

const setLogLevel = (verbosity) => {
  const levels = ['warn', 'info', 'debug', 'trace']
  const index = (verbosity == null) ? 0 : Math.min(levels.length, verbosity.length)
  log.setLevel(levels[index])
}

const main = async () => {
  const options = await commandLineArgs(optionDefinitions, process.argv)
  try {
    if (options.help) { await generateHelp(); process.exit(0) }
    setLogLevel(options.verbose)
    if (options.interactive) await optionsQueries(options)
    if (options.dir == null) options.dir = '.'
    options.dir = resolvePath(process.cwd(), untildify(options.dir))
    const packageJson = await readPackageJson(options.dir)
    if (!options.interactive) chooseDefaults(packageJson, options)
    resolveOptionDirectories(options)
    displayOptions(options, optionDefinitions)
    await runTest(packageJson, options)
  } catch (error) {
    log.error(error)
    displayOptions(options, optionDefinitions)
  }
}

main()
