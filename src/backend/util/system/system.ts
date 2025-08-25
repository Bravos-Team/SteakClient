import chalk from 'chalk'
import { ChildProcess, exec, spawn } from 'child_process'
import { existsSync, mkdirSync } from 'fs-extra'
import { promisify } from 'util'
import * as os from 'os'
import { CommandResult, Logger } from 'src/backend/wine/type'
import { webSocket } from 'src/backend/ws/types'

const execAsync = promisify(exec)

export class ColorLogger implements Logger {
  info(message: string): void {
    console.log(chalk.blue(`ℹ️  ${message}`))
  }

  warn(message: string): void {
    console.log(chalk.yellow(`⚠️  ${message}`))
  }

  error(message: string): void {
    console.log(chalk.red(`❌ ${message}`))
  }

  success(message: string): void {
    console.log(chalk.green(`✅ ${message}`))
  }

  debug(message: string): void {
    console.log(chalk.gray(`🔍 ${message}`))
  }
}

export class SystemUtils {
  private static logger: Logger = new ColorLogger()
  //   static async executeCommandWebSocket(
  //     command: string,
  //     args: string[] = [],
  //     options: {
  //       env?: Record<string, string>
  //       cwd?: string
  //       timeout?: number
  //     } = {},
  //     ws: webSocket | null = null,
  //   ): Promise<CommandResult> {
  //     const startTime = Date.now()
  //     // TODO: Implement WebSocket command execution logic here
  //     return new Promise((resolve, reject) => {
  //       // WebSocket connection logic

  //       if (!ws) {
  //         reject(new Error('WebSocket connection is not established'))
  //         return
  //       }

  //     })
  //   }
  /**
   * Executes a command with the given arguments and options.
   * @param command The command to execute.
   * @param args The arguments to pass to the command.
   * @param options Options for the command execution.
   * @returns A promise that resolves to the command result.
   */
  static async executeCommand(
    command: string,
    args: string[] = [],
    options: {
      env?: Record<string, string>
      cwd?: string
      timeout?: number
    } = {},
  ): Promise<CommandResult> {
    // TODO: Implement command execution logic here
    const startTime = Date.now()
    return new Promise((resolve) => {
      this.logger.debug(`Executing command: ${command} ${args.join(' ')}`)
      const env = { ...process.env, ...options.env }
      const child = spawn(command, args, {
        env,
        cwd: options.cwd,
        stdio: ['pipe', 'pipe', 'pipe'],
      })

      let stdout = ''
      let stderr = ''
      child.stdout?.on('data', (data) => {
        stdout += data.toString()
      })
      child.stderr?.on('data', (data) => {
        stderr += data.toString()
      })

      child.on('close', (exitCode) => {
        const duration = Date.now() - startTime
        const result: CommandResult = {
          success: exitCode === 0,
          exitCode: exitCode ? exitCode : 0,
          stdout: stdout.trim(),
          stderr: stderr.trim(),
          duration,
        }
        if (result.success) {
          this.logger.debug(`Command executed successfully in ${duration}ms`)
          resolve(result)
        } else {
          this.logger.error(`Command failed with exit code ${result.exitCode} in ${duration}ms`)
          if (stderr) this.logger.error(`Error output: ${stderr}`)
        }
      })
      child.on('error', (error) => {
        const duration = Date.now() - startTime
        resolve({
          success: false,
          exitCode: 1,
          stdout: '',
          stderr: error.message,
          duration,
        })
      })
      if (options.timeout) {
        setTimeout(() => {
          child.kill()
          resolve({
            success: false,
            exitCode: 1,
            stdout: '',
            stderr: 'Command timed out',
            duration: Date.now() - startTime,
          })
        }, options.timeout)
      }
    })
  }
  static async executeCommandWine(
    command: string,
    args: string[] = [],
    options: {
      env?: Record<string, string>
      cwd?: string
      timeout?: number
      signal?: AbortSignal
    } = {},
  ): Promise<ChildProcess> {
    // TODO: Implement command execution logic here

    this.logger.debug(`Executing command: ${command} ${args.join(' ')}`)
    const env = { ...process.env, ...options.env }
    const child = spawn(command, args, {
      env,
      cwd: options.cwd,
      stdio: ['pipe', 'pipe', 'pipe'],
      signal: options.signal,
    })
    return child
  }

  /**
   * Checks if a file exists at the given path.
   * @param filePath The path to the file.
   * @returns True if the file exists, false otherwise.
   */
  static fileExists(filePath: string): boolean {
    try {
      return existsSync(filePath)
    } catch (error) {
      return false
    }
  }

  /**
   * Creates a directory at the given path.
   * @param dirPath The path to the directory.
   * @returns True if the directory was created or already exists, false otherwise.
   */
  static createDirectory(dirPath: string): boolean {
    try {
      if (!existsSync(dirPath)) {
        mkdirSync(dirPath, { recursive: true })
      }
      return true
    } catch (error) {
      this.logger.error(`Failed to create directory ${dirPath}: ${error}`)
      return false
    }
  }

  /**
   * Gets the size of a directory.
   * @param dirPath The path to the directory.
   * @returns The size of the directory.
   */
  static async getDirectorySize(dirPath: string): Promise<string> {
    try {
      const result = await execAsync(`du -sh "${dirPath}" 2>/dev/null | cut -f1`)
      return result.stdout.trim() || 'Unknown'
    } catch (error) {
      return 'Unknown'
    }
  }

  /**
   * Gets the current user information.
   * @returns The current user information.
   */
  static getCurrentUser(): { username: string; homeDirectory: string } {
    return {
      username: os.userInfo().username,
      homeDirectory: os.userInfo().homedir,
    }
  }

  // /**
  //  * Finds all Wine installations on the system.
  //  * @returns A list of Wine installation information.
  //  */
  // static async findWineInstallations(): Promise<WineInstallInfo[]> {
  //   const installations: WineInstallInfo[] = []

  //   // Tìm system wine
  //   try {
  //     const result = await this.executeCommand('which', ['wine'])
  //     if (result.success) {
  //       const versionResult = await this.executeCommand('wine', ['--version'])
  //       installations.push({
  //         name: 'System Wine',
  //         installPath: result.stdout,
  //         version: {
  //           version: versionResult.stdout.trim(),
  //           type: 'system',
  //           date: new Date().toISOString().split('T')[0],
  //           download: '',
  //           downsize: 0,
  //           disksize: 0,
  //           checksum: '',
  //         },
  //         type: 'system',
  //       })
  //     }
  //   } catch {
  //     // System wine not found
  //   }

  //   return installations
  // }

  /**
   * Gets the GPU information.
   * @returns The GPU information.
   */
  static async getGPUInfo(): Promise<string> {
    try {
      const result = await this.executeCommand('lspci', [])
      const gpuLines = result.stdout
        .split('\n')
        .filter((line) => line.toLowerCase().includes('vga') || line.toLowerCase().includes('3d'))

      return gpuLines.length > 0 ? gpuLines[0] : 'Unknown GPU'
    } catch {
      return 'Unable to detect GPU'
    }
  }

  /**
   * Checks if Vulkan is supported on the system.
   * @returns True if Vulkan is supported, false otherwise.
   */
  static async checkVulkanSupport(): Promise<boolean> {
    try {
      const result = await this.executeCommand('vulkaninfo', ['--summary'])
      return result.success
    } catch {
      return false
    }
  }
}
