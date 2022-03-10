import React, { Component } from "react";
import { QuorumConfig, QuorumNode } from '../Types/QuorumConfig';
import PageHeader from "../Misc/PageHeader";
import NodeOverview from "../Nodes/NodeOverview";
import NodeDetails from "../Nodes/NodeDetails";
import { updateNodeInfo } from "../API/Nodes";
import { FaPlay, FaStop } from "react-icons/fa";
import { GiCube } from "react-icons/gi";
import { BsFillPeopleFill } from "react-icons/bs";
import { VscArrowSwap } from "react-icons/vsc";
import { Cards } from "../Types/Nodes";
import { getDetailsByNodeName, getNodeKeys } from "../API/QuorumConfig";
import { Container } from "@chakra-ui/react";

interface IProps {
  config: QuorumConfig
}

interface IState {
  delay: number,
  client: string,
  selectedNode: string,
  nodeId: string,
  nodeName: string,
  enode: string,
  ip: string,
  rpcUrl: string,
  statusText: string,
  blocks: number,
  peers: number,
  queuedTxns: number,
  pendingTxns: number,
  showPending: boolean
}

export default class Nodes extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.childHandler = this.childHandler.bind(this);
    this.state = {
      delay: 1000,
      client: this.props.config.nodes[0].client,
      selectedNode: this.props.config.nodes[0].name,
      nodeId: "",
      nodeName: "",
      enode: "",
      ip: "127.0.0.1",
      rpcUrl: "http://127.0.0.1:8545",
      statusText: "error",
      blocks: 0,
      peers: 0,
      queuedTxns: 0,
      pendingTxns: 0,
      showPending: false,
    };
  }

  intervalId: number = 0;
  nodeKeys: string[] = getNodeKeys(this.props.config);

  childHandler = (dropDownNode:any) => {
    // console.log(dropDownNode);
    this.setState({
      selectedNode: dropDownNode.target.value,
    });
  };

  async nodeInfoHandler(node:string) {
    // console.log("nodeInfoHandler");
    try {
      const needle: QuorumNode = getDetailsByNodeName(this.props.config, node)
      const rpcUrl:string = needle.rpcUrl;
      const res = await updateNodeInfo(rpcUrl);
      this.setState({
        client: needle.client,
        selectedNode: node,
        statusText: res.statusText,
        nodeId: res.nodeId,
        nodeName: res.nodeName,
        enode: res.enode,
        ip: res.ip,
        rpcUrl: rpcUrl,
        blocks: res.blocks,
        peers: res.peers,
        showPending: false,
      });
    } catch (e) {
      console.log(
        "Node is unreachable. Ensure ports are open and client is running!"
      );
      this.setState({
        showPending: true,
      });
    }

    // console.log('State: '+ JSON.stringify(this.state, null, 2));
  }

  tick = () => {
    this.nodeInfoHandler(this.state.selectedNode);
  };

  // content visible on screen
  async componentDidMount() {
    console.log("component rendered to screen");
    this.intervalId = window.setInterval(this.tick, this.state.delay);
    this.nodeInfoHandler(this.state.selectedNode);
  }

  // sit and wait to updates from setState
  componentDidUpdate() {
    console.log("component just updated and re rendered");
  }

  // sit and wait till component is no longer shown
  componentWillUnmount() {
    console.log("component gone off screen");
    clearInterval(this.intervalId);
  }

  handleSelectNode = (e:any) => {
    console.log(e);
    this.nodeInfoHandler(e);
  }

  render() {
    const stats: Cards[] = [
      {
        label: "Status",
        value: this.state.showPending === false ? "Running" : "Stopped",
        icon:
          this.state.showPending === false ? (
            <FaPlay size="1.5em" />
          ) : (
            <FaStop size="1.5em" />
          ),
      },
      {
        label: "Blocks",
        value: this.state.blocks,
        icon: <GiCube size="2em" />,
      },
      {
        label: "Peers",
        value: this.state.peers,
        icon: <BsFillPeopleFill size="2em" />,
      },
      {
        label: "Queued",
        value: this.state.queuedTxns,
        icon: <VscArrowSwap size="2em" />,
      },
    ];

    return (
      <>
      <Container maxW={{ base: "container.sm", md: "container.xl" }} h="100vh" >
        <PageHeader title="Nodes" config={this.props.config} selectNodeHandler={this.handleSelectNode} />
        <NodeOverview stats={stats} showPending={this.state.showPending} />
        <NodeDetails
          client={this.state.client}
          nodeId={this.state.nodeId}
          nodeName={this.state.nodeName}
          enode={this.state.enode}
          rpcUrl={this.state.rpcUrl}
          ip={this.state.ip}
        />
      </Container>
      </>
    );
  }
}