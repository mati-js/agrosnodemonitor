import * as fileSystem from 'fs';

let interval = process.argv[2] || 10;
let loggerDir = './logs';

const NODES_CONF = {
  urls: {
    local: '172.15.0.150',
    remote: '186.182.10.177'
  },
  ports: {
    local: 8989,
    remote: 8989
  }
}

async function log(line) {

  let todayDate = new Date();
  let dateToWrite = `${todayDate.getUTCDate()}-${todayDate.getMonth()}-${todayDate.getFullYear()}`;
  let timeToWrite = `${todayDate.getMinutes()} pasados de las ${todayDate.getHours()}`

  fileSystem.appendFileSync(
    `${loggerDir}/${dateToWrite}.txt`,
    `${dateToWrite} a los ${timeToWrite} - ${line}\n`
  );
}

async function checkNodeStatus() {

  /* Fetch local first */
  let status = {};
  
  ['local', 'remote'].forEach(async destination => {

    await log(`Fetching ${destination} node URL. (http://${NODES_CONF.urls[destination]}:${NODES_CONF.ports[destination]})`);

    try {
      
      status.destination = await (
        await fetch(
          `http://${NODES_CONF.urls[destination]}:${NODES_CONF.ports[destination]}`,
          {
            method: 'POST',
            body: '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":51}'
          }
        )
      ).json();

    } catch (error) {
      
      await log(`Error in fetch to ${destination}: ${error.message}`);
      // Send email
    }

    if (status.destination.response)
      await log(`Node ${destination} returned ${status.destination.response}`);

  });

}

(async function main() {

  // Validate interval
  console.log(`> Interval setted to ${interval} seconds.`);

  checkNodeStatus();

})();