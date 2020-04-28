import { dirname, join, relative, resolve } from 'path'
import fs from 'fs-extra'
import { makePackageTests } from './make-package-tests'
import rrdir from 'rrdir'
import execa from 'execa'

const transformTests = async (packageName, options) => {
  const sourceDirectory = options.src
  const testDirectory = options.test // required
  const testGlobs = [options.glob] // required, excludes helpers via naming convention
  const targetDirectory = options.at
  const testDependencies = new Set()
  // Walk testDirectory, and rollup each test individually, remembering dependencies
  for await (const entry of rrdir(testDirectory, { exclude: ['node_modules'], include: testGlobs })) {
    if (entry.directory) continue
    const outputPath = resolve(targetDirectory, relative(dirname(testDirectory), entry.path))
    const pluginOptions = {
      pkgName: packageName,
      relativeSrcPath: relative(dirname(entry.path), sourceDirectory)
    }
    const inputOptions = {
      input: entry.path
    }

    const outputOptions = {
      file: outputPath,
      format: 'es'
    }
    const entryPointDependencies = await makePackageTests(pluginOptions, inputOptions, outputOptions)
    entryPointDependencies.forEach(dependency => testDependencies.add(dependency))
  }
  return testDependencies
}

const buildTestDependencies = (packageJson, testDependencies) => {
  const dependencies = {}
  dependencies[packageJson.name] = buildPackPath(packageJson)
  dependencies.esm = '>=3.2.25'
  const allPackageDependencies = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies
  }
  testDependencies.forEach(dependency => {
    dependencies[dependency] = allPackageDependencies[dependency] // copy version across
  })
  return dependencies
}

const buildTestPackageJson = (options, packageJson, dependencies) => {
  const relativeTestPath = relative(options.dir, options.test)
  return {
    name: 'pkgtest',
    version: '1.0.0',
    description: `Package testing for ${packageJson.name}`,
    main: 'index.js',
    scripts: {
      test: `tape -r esm '${relativeTestPath}/${options.glob}'`
    },
    author: '',
    license: 'MIT',
    dependencies: buildTestDependencies(packageJson, dependencies),
    devDependencies: {
      tape: '^4.13.2'
    }
  }
}

const buildPackPath = (packageJson) => {
  const scope = packageJson.name.replace('@', '').replace('/', '-')
  const version = packageJson.version
  return `${scope}-${version}.tgz`
}

const runNpmCommand = async (command, options) => {
  console.log(`RUNNING npm ${command}`)
  const { stdout, stderr } = await execa('npm', [command])
  if (!options.quiet) {
    console.log(stdout)
    console.log(stderr)
  }
}

export const runTest = async (packageJson, options) => {
  const testDirectory = resolve(options.at, relative(options.dir, options.test))
  await fs.ensureDir(testDirectory)
  const dependencies = await transformTests(packageJson.name, options)
  const testPackageJson = buildTestPackageJson(options, packageJson, dependencies)
  await fs.writeJSON(join(options.at, 'package.json'), testPackageJson, { spaces: 2 })
  const cwd = process.cwd()
  try {
    // NPM is meant only to be used via CLI, not programmatically - great
    // npm pack only drops *.tgz pack file in cwd
    await process.chdir(options.dir)
    await runNpmCommand('pack', options)
    const packPath = buildPackPath(packageJson)
    await fs.move(join(options.dir, packPath), join(options.at, packPath), { overwrite: true })
    await process.chdir(options.at)
    await runNpmCommand('install', options)
    await runNpmCommand('test', options)
  } finally {
    await process.chdir(cwd)
  }
}
