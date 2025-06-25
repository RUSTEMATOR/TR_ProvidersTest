import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class VpnController {
  constructor() {}

  async runVPN(command: string): Promise<string> {
    try {
      const { stdout, stderr } = await execAsync(command, {
        cwd: 'C:/Program Files (x86)/ExpressVPN/services/',
      });

      if (stderr) {
        console.error(`Command stderr: ${stderr}`);
      }

      return stdout;
    } catch (error: any) {
      console.error(`Error executing command: ${error.message}`);
      return '';
    }
  }

  async vpnConnect(location: string) {
    try {
      await this.runVPN(`ExpressVPN.CLI connect "${location}"`);
    } catch (error) {
      console.error(`Error connecting to VPN: ${error}`);
    }
  }

  async vpnDisconnect() {
    await this.runVPN('ExpressVPN.CLI disconnect');
  }

  async vpnCheckStatus(): Promise<'connected' | 'connecting' | 'disconnected' | 'unknown'> {
    const output = await this.runVPN('ExpressVPN.CLI status');

    if (output.includes('Connected to')) {
      return 'connected';
    }

    if (output.includes('Connecting...')) {
      return 'connecting';
    }

    if (output.includes('Not connected')) {
      return 'disconnected';
    }

    return 'unknown';
  }

  async isConnectedToLocation(targetLocation: string): Promise<boolean> {
    const output = await this.runVPN('ExpressVPN.CLI status');

    const match = output.match(/Connected to ([^\n]+)/);
    if (match) {
      const connectedLocation = match[1].trim();
      return connectedLocation.toLowerCase() === targetLocation.toLowerCase();
    }

    return false;
  }

  async sleepVPN(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export default VpnController;
