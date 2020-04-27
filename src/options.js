export const optionDefinitions = [
  {
    name: 'dir',
    alias: 'd',
    type: String,
    typeLabel: '<pkgDir>',
    defaultOption: true, // default means can appear at end wo flag
    description: 'NPM package directory'
  },
  {
    name: 'src',
    alias: 's',
    type: String,
    typeLabel: '<srcPath>',
    description: 'relative source directory within package'
  },
  {
    name: 'test',
    alias: 't',
    type: String,
    typeLabel: '<testPath>',
    description: 'relative test directory within package'
  },
  {
    name: 'glob',
    alias: 'g',
    type: String,
    typeLabel: '<glob>',
    description: 'glob that matches test files within test directory'
  },
  {
    name: 'at',
    alias: 'a',
    type: String,
    typeLabel: '<at>',
    description: 'directory to run test in'
  },
  {
    name: 'interactive',
    alias: 'i',
    type: Boolean,
    description: 'ask for missing command line parameters'
  },
  {
    name: 'quiet',
    alias: 'q',
    type: Boolean,
    description: 'non-interactive'
  },
  {
    name: 'help',
    alias: 'h',
    type: Boolean,
    description: 'show help guide'
  }
]
