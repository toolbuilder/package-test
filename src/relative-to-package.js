// Convert relative imports from package src directory to package imports for this package
export default (options) => {
  let entryPoint = null
  const externalPackages = [] // make list of external packages available later
  return {
    name: 'relative-to-package',
    buildStart (inputOptions) {
      entryPoint = inputOptions.input
    },
    resolveId (source) {
      // only handles imports that will be exported by package
      if (source.startsWith(options.relativeSrcPath)) return { id: options.pkgName, external: true }
      if (source.startsWith('.')) return null // let rollup handle it (perhaps node-resolve?)
      if (source !== entryPoint) {
        externalPackages.push(source)
        return { id: source, external: true } // auto external packages
      }
      return null
    },
    external () { return externalPackages }
  }
}
