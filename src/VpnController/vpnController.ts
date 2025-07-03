import { spawn } from 'child_process'
import { promisify } from 'util';



export class VpnController {
  constructor() {}

  async runVPN(command: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const [cmd, ...args] = command.split(' ');
      const vpn = spawn('expressvpn', [cmd, ...args]);

      let stdout = '';
      let stderr = '';

      vpn.stdout.on('data', (data) => {
        const text = data.toString();
        stdout += text;
        process.stdout.write(`[VPN stdout] ${text}`); // optional live logging
      });

      vpn.stderr.on('data', (data) => {
        const text = data.toString();
        stderr += text;
        process.stderr.write(`[VPN stderr] ${text}`);
      });

      vpn.on('close', (code) => {
        if (code === 0) {
          resolve(stdout);
        } else {
          reject(new Error(`VPN command failed: ${stderr}`));
        }
      });
    });
  }


  async vpnConnect(location: string): Promise<void> {
    await this.vpnDisconnect()
    await this.runVPN(`connect ${location}`);
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


async waitForVpnConnection(targetLocation: string, timeoutMs = 30000) {
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    const isConnected = await this.isConnectedToLocation(targetLocation);
    if (isConnected) return;
    console.log(`[⏳] Waiting for VPN to connect to ${targetLocation}...`);
    await this.sleepVPN(2000);
  }

  throw new Error(`VPN failed to connect to ${targetLocation} within ${timeoutMs / 1000}s`);
}
}

export default VpnController;
