import yargs from "yargs/yargs"
import fs from "fs"
import path from "path"
import { spawn, exec } from "child_process"
import { Logger } from "./logger"
import chalk from "chalk"

const logger = new Logger(`${chalk.gray("[")}${chalk.bold.red("PYPM")}${chalk.gray("]")} `)

const command = yargs()
    .command("init", "Initializes a package.json file", yargs => {
        return yargs
    }, argv => {
        var packageJson = {
            name: path.basename(process.cwd()),
            version: "1.0.0",
            description: "",
            main: "index.py",
            scripts: {
              test: "echo \"Error: no test specified\" && exit 1"
            },
            keywords: [],
            author: "",
            license: "ISC",
            dependencies: {}
        }
        fs.writeFileSync("package.json", JSON.stringify(packageJson, null, 2))
    })
    .command(["install [package]", "i"], "Installs a pip package", yargs => {
        return yargs
            .positional("package", {
                describe: "package to install",
                type: "string"
            })
            .option("dev", {
                describe: "set if package is a dev dependency",
                type: "boolean",
                alias: "D"
            })
    }, argv => {
        if (!fs.existsSync("packages")) fs.mkdirSync("packages")
        if (fs.existsSync("package.json")) {
            if (!argv.package) {
                if (argv.dev) {
                    logger.log("Installing all dev dependencies...")
                    installAllFromPackage(true)
                } else {
                    installAllFromPackage()
                    logger.log("Installing all dependencies...")
                }
                return
            }
            const version = argv.package.includes("@") ? argv.package.split("@")[1] : "latest"
            const packageName = version === "latest" ? argv.package : argv.package.split("@")[0]
            const installer = spawn(`pip3`, ["install", "-t", "packages", "--upgrade", argv.package.replace("@", "==")])
            installer.stdout.on("data", data => {
                const content = String(data)
                logger.log(content)
            })
            installer.stderr.on("data", data => {
                const content = String(data)
                logger.error(content)
            })
            installer.on("exit", code => {
                if (code !== null) {
                    const packageJson = JSON.parse(fs.readFileSync("package.json").toString())
                    packageJson[argv.dev ? "devDependencies" : "dependencies"][packageName] = version
                    fs.writeFileSync("package.json", JSON.stringify(packageJson, null, 2))
                } else {
                    logger.error(`Installation for ${argv.package} failed!`)
                }
            })
        } else {
            logger.error("Error: You are not in a pypm package! Initialize one with `pypm init -y`")
        }  
    })
    .command(["uninstall <package>", "rm"], "Uninstalls a pip package", yargs => {
        return yargs
            .positional("package", {
                describe: "package to uninstall",
                type: "string"
            })
            .option("dev", {
                describe: "set if package is a dev dependency",
                type: "boolean",
                alias: "D"
            })
    }, argv => {
        if (!fs.existsSync("packages")) fs.mkdirSync("packages")
        if (fs.existsSync("package.json")) {
            const packageJson = JSON.parse(fs.readFileSync("package.json").toString())
            if (argv.dev) {
                if (packageJson.devDependencies[argv.package]) {
                    logger.log("Dev dependency " + argv.package + " uninstalled")
                    delete packageJson.devDependencies[argv.package]
                } else {
                    logger.log("The specified package " + argv.package + " is not installed!")
                }
            } else {
                if (packageJson.dependencies[argv.package]) {
                    logger.log("Dependency " + argv.package + " uninstalled")
                    delete packageJson.dependencies[argv.package]
                } else {
                    logger.log("The specified package " + argv.package + " is not installed!")
                }
            }
            fs.writeFileSync("package.json", JSON.stringify(packageJson, null, 2))
        } else {
            logger.error("Error: You are not in a pypm package! Initialize one with `pypm init -y`")
        }  
    })
    .command("config <key> <value>", "Modify key-value configuration", yargs => {
        return yargs
            .positional("key", {
                describe: "config key to set",
                type: "string"
            })
            .positional("value", {
                describe: "config value to set",
                type: "string"
            })
    }, argv => {
        if (!fs.existsSync(path.join(__dirname, "config.json"))) fs.writeFileSync(path.join(__dirname, "config.json"), "{}")
        const configFile = JSON.parse(fs.readFileSync(path.join(__dirname, "config.json")).toString())
        configFile[argv.key] = argv.value
        fs.writeFileSync(path.join(__dirname, "config.json"), JSON.stringify(configFile))
    })
    .command("run [script] [arguments]", "Runs a pypm script", yargs => {
        return yargs
            .positional("script", {
                describe: "script to run",
                type: "string"
            })
            .positional("arguments", {
                describe: "script arguments",
                type: "string"
            })
    }, argv => {
        if (fs.existsSync("package.json")) {
            const packageJson = JSON.parse(fs.readFileSync("package.json").toString())
            if (argv.script) {
                if (packageJson.scripts[argv.script]) {
                    const command = (packageJson.scripts[argv.script])+(argv.arguments ? " "+argv.arguments : "")
                    
                    const commandExecution = exec(command)
                    logger.line()
                    logger.log(`> ${packageJson.name}@${packageJson.version} ${argv.script}`)
                    logger.log(`> ${command}`)
                    logger.line()
    
                    commandExecution.stdout.on("data", data => {
                        const content = String(data)
                        logger.log(content)
                    })
                    commandExecution.stderr.on("data", data => {
                        const content = String(data)
                        logger.error(content)
                        commandExecution.kill()
                    })
                } else {
                    logger.error("That package script does not exist!")
                }
            } else {
                logger.log(`${chalk.bold("Package scripts")} inside ${chalk.green(packageJson.name+"@"+packageJson.version)}`)
                for (let script in packageJson.scripts) {
                    logger.log(chalk.bold("  "+script))
                    logger.log(chalk.gray("   "+packageJson.scripts[script]))
                }
            }
        } else {
            logger.error("Error: You are not in a pypm package! Initialize one with `pypm init -y`")
        }
    })
    .recommendCommands()
    .demandCommand()

function installAllFromPackage(dev?: boolean) {
    var requirements = ""
    const packageJson = JSON.parse(fs.readFileSync("package.json").toString())
    if (!dev) {
        for (var dependency in packageJson.dependencies) {
            requirements+=dependency+"=="+packageJson.dependencies[dependency]+"\n"
        }
    } else {
        for (var dependency in packageJson.devDependencies) {
            requirements+=dependency+"=="+packageJson.devDependencies[dependency]+"\n"
        }
    }
    fs.writeFileSync(".requirements.txt.tmp", requirements)
    const installer = spawn(`pip3`, ["install", "-t", "packages", "-r", ".requirements.txt.tmp"])
    installer.stdout.on("data", data => {
        const content = String(data)
        logger.log(content)
    })
    installer.stderr.on("data", data => {
        const content = String(data)
        logger.error(content)
    })
    installer.on("exit", code => {
        fs.rmSync(".requirements.txt.tmp")
    })
}

export {command}