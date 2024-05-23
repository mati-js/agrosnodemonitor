import * as fileSystem from 'fs';

let loggerDir = process.env.LOGGER_DIR || './logs';
let NODES_CONF = {
  urls: {
    local: process.env.LOCAL_URL,
    remote: process.env.REMOTE_URL
  },
  ports: {
    local: process.env.LOCAL_PORT,
    remote: process.env.REMOTE_PORT
  }
}

export async function log(line) {
  
  let todayDate = new Date();
  let dateToWrite = `${todayDate.getUTCDate()}-${todayDate.getMonth()}-${todayDate.getFullYear()}`;
  let timeToWrite = `${todayDate.getMinutes()} pasados de las ${todayDate.getHours()}`

  fileSystem.appendFileSync(
    `${loggerDir}/${dateToWrite}.txt`,
    `${dateToWrite} a los ${timeToWrite} - ${line}\n`
  );
}

export async function fetchNodeStatus(req, res) {
  
  try {
    /* Fetch local first */
    let status = {};

    console.log(NODES_CONF)

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

    res.status(200).json({
      status
    })

  } catch (error) {

    res.status(500).json({
      error: error.message
    })

  }

};