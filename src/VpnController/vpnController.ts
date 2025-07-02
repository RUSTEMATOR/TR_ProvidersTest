import { exec } from "child_process";
import { promisify } from 'util';

const execAsync = promisify(exec);

export class VpnController {
  constructor() {}

  async runVPN(command: string): Promise<string> {
    try {
      const { stdout, stderr } = await execAsync(`expressvpn ${command}`);

      if (stderr) {
        console.error(`Command stderr: ${stderr}`);
      }

      return stdout;
    } catch (error: any) {
      console.error(`Error executing command: ${error.message}`);
      return '';
    }
  }

  async vpnConnect(location: string): Promise<void> {
    await this.runVPN(`connect "${location}"`);
  }

  async vpnDisconnect(): Promise<void> {
    await this.runVPN('disconnect');
  }

  async vpnCheckStatus(): Promise<string> {
    return await this.runVPN('status');
  }

  async sleepVPN(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async isConnectedToLocation(targetLocation: string): Promise<boolean> {
    const output = await this.runVPN('status');
    const match = output.match(/Connected to ([^\n]+)/);
    
    if (match) {
      const connectedLocation = match[1].trim();
      return connectedLocation.toLowerCase() === targetLocation.toLowerCase();
    }

    return false;
  }
}

export default VpnController;
