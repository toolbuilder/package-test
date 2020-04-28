export const optionDefinitions = [
  {
    name: 'dir',
    alias: 'd',
    type: String,
    typeLabel: '<pkgDir>',
    defaultOption: true, // default means can appear at end wo flag
    description: 'NPM package directory',
    query: true
  },
  {
    name: 'src',
    alias: 's',
    type: String,
    typeLabel: '<srcPath>',
    description: 'relative source directory within package',
    query: true
  },
  {
    name: 'test',
    alias: 't',
    type: String,
    typeLabel: '<testPath>',
    description: 'relative test directory within package',
    query: true
  },
  {
    name: 'glob',
    alias: 'g',
    type: String,
    typeLabel: '<glob>',
    description: 'glob that matches test files within test directory',
    query: true
  },
  {
    name: 'at',
    alias: 'a',
    type: String,
    typeLabel: '<at>',
    description: 'directory to run test in',
    query: true
  },
  {
    name: 'interactive',
    alias: 'i',
    type: Boolean,
    description: 'ask for missing command line parameters'
  },
  {
    name: 'help',
    alias: 'h',
    type: Boolean,
    description: 'show help guide'
  },
  {
    name: 'verbose',
    alias: 'v',
    type: Boolean,
    description: "show more information with more v's",
    lazyMultiple: true
  }
]
