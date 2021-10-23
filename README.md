# NPM-Python

Npm styled python package manager.

Installation: `npm install @tkdkid1000/pypm`

## Usage

```bash
you@localhost:~/python-package$ pypm                        
pypm <command>

Commands:
  pypm init                      Initializes a package.json file
  pypm install [package]         Installs a pip package             [aliases: i]
  pypm uninstall <package>       Uninstalls a pip package          [aliases: rm]
  pypm config <key> <value>      Modify key-value configuration
  pypm run [script] [arguments]  Runs a pypm script

Options:
  --help     Show help                                                 [boolean]
  --version  Show version number                                       [boolean]

```

## Commands

### init
Initialize a package. Nothing complex.
`pypm init`

### install
Installs the specified package, or re installs packages in package.json.
`pypm install`
`pypm install <packagename>`
You can specify the package version to install with `package@version`

### uninstall
Uninstalls the specified package.
`pypm uninstall <packagename>`

### config
Sets config values for pypm. Not really needed yet.
`pypm config <key> <value>`

### run
Runs package scripts.
`pypm run`
`pypm run <script> [args]`
