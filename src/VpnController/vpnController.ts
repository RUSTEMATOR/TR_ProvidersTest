import { exec } from "child_process";
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

   async vpnConnnect(location: string){
        this.runVPN(`ExpressVPN.CLI connect "${location}"`);
    }
    

   async vpnDisconnect(){
        this.runVPN('ExpressVPN.CLI disconnect');
        }
    
   async vpnCheckStatus(){
        const status = this.runVPN('ExpressVPN.CLI status')
        return status
    }

    async sleepVPN(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
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
}

export default VpnController