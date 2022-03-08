const axios = require("axios");

export async function ethApiCall(url, method) {
  return axios({
    method: "post",
    url: url,
    data: {
      jsonrpc: "2.0",
      method: method,
      params: [],
      id: 1,
    },
    headers: { "Content-Type": "application/json" },
  });
}

export async function updateNodeInfo(url) {
  let nodeDetails = {
    status: "error",
    nodeId: "",
    nodeName: "",
    enode: "",
    ip: "",
  };

  const adminNodeInfo = await ethApiCall(url, "admin_nodeInfo");
  const ethBlockNumber = await ethApiCall(url, "eth_blockNumber");
  const netPeerCount = await ethApiCall(url, "net_peerCount");
  const txPoolStatus = await ethApiCall(url, "txpool_status");
  nodeDetails["statusText"] = adminNodeInfo.statusText;
  nodeDetails["nodeId"] = adminNodeInfo.data.result.id;
  nodeDetails["nodeName"] = adminNodeInfo.data.result.name;
  nodeDetails["enode"] = adminNodeInfo.data.result.enode;
  nodeDetails["ip"] = adminNodeInfo.data.result.ip;
  nodeDetails["blocks"] = parseInt(ethBlockNumber.data.result, 16);
  nodeDetails["peers"] = parseInt(netPeerCount.data.result, 16);
  nodeDetails["queuedTxns"] = parseInt(txPoolStatus.data.result.queued, 16);
  nodeDetails["pendingTxns"] = parseInt(txPoolStatus.data.result.pending, 16);

  return nodeDetails;
}