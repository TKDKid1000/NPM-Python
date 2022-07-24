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

## Contribution

I accept any and all contributions to this project. Please format your code with `npm run format` before committing.

My goals are to implement every existing feature in npm, but designed for python.

Known Issues:

[ ] The python interpreter doesn't run in an M1 \(Arm\) based system. This is likely due to the different architecture, because it works on linux in GitHub Codespaces and an old Windows computer I tested this on.
[ ] Most system commands don't work when you are in a nested folder, currently only at the root. Should be as easy as implementing a crawler that scans directories upwards until finding a `package.json`.