import { rollup } from 'rollup'
import relativeToPackage from './relative-to-package'

// NOTE: removed node-resolve plugin, perhaps it is still needed?
export const makePackageTests = async (pluginOptions, inputOptions, outputOptions) => {
  const plugin = relativeToPackage(pluginOptions)
  const bundle = await rollup({
    ...inputOptions,
    plugins: [
      plugin
    ]
  })
  // In a static situation, external package list is available in inputOptions
  // We could use bundle.generate(outputOptions) to get access to dependencies
  // in a rather convoluted way. Or use the relativeToPackage plugin to collect
  // the data while it is working
  /*
  const { output } = bundle.generate(outputOptions)
  const external = output
    .filter(chunk => chunk.inputs != null)
    .map(chunk => chunk.inputs)
    .reduce((deps, inputs) => deps.concat(inputs), [])
    .filter(dependency => dependency !== pkgName)
  */
  await bundle.write(outputOptions)
  return plugin.external()
}
