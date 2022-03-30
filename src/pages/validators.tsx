import { useCallback, useEffect, useState, useRef } from "react";
import { Divider, Container, SimpleGrid } from "@chakra-ui/react";
import PageHeader from "../common/components/Misc/PageHeader";
import { QuorumConfig, QuorumNode } from "../common/types/QuorumConfig";
import ValidatorsActive from "../common/components/Validators/ValidatorsActive";
import ValidatorsPending from "../common/components/Validators/ValidatorsPending";
import ValidatorsPropose from "../common/components/Validators/ValidatorsPropose";
import ValidatorsAbout from "../common/components/Validators/ValidatorAbout";
import {
  getCurrentValidators,
  getPendingVotes,
} from "../common/api/validators";
import { getDetailsByNodeName } from "../common/api/quorumConfig";

const config: QuorumConfig = require("../config/config.json");

interface IState {
  selectedNode: string;
  rpcUrl: string;
  minersList: string[];
  pendingList: string[];
}

export default function Validators() {
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const refreshFrequency: number = 1000;
  const [validators, setValidators] = useState<IState>({
    selectedNode: config.nodes[0].name,
    rpcUrl: config.nodes[0].rpcUrl,
    minersList: [],
    pendingList: [],
  });

  const nodeInfoHandler = useCallback(async (node: string) => {
    const needle: QuorumNode = getDetailsByNodeName(config, node);
    const rpcUrl: string = needle.rpcUrl;
    const client: string = needle.client;

    return Promise.all([
      getCurrentValidators(rpcUrl, client, config.algorithm),
      getPendingVotes(rpcUrl, client, config.algorithm),
    ]).then(([currentVal, pendingVal]) => {
      setValidators({
        selectedNode: node,
        rpcUrl: rpcUrl,
        minersList: currentVal,
        pendingList: pendingVal,
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log("rendering...");
    // nodeInfoHandler(validators.selectedNode);

    intervalRef.current = setInterval(() => {
      nodeInfoHandler(validators.selectedNode);
      console.log("called for new info...");
    }, refreshFrequency);

    return () => {
      clearInterval(intervalRef.current as NodeJS.Timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validators.selectedNode]);

  const handleSelectNode = (e: any) => {
    clearInterval(intervalRef.current as NodeJS.Timeout);
    console.log("cleaned up: " + intervalRef.current);
    setValidators({ ...validators, selectedNode: e.target.value });
  };

  return (
    <>
      <Container maxW={{ base: "container.sm", md: "container.xl" }}>
        <PageHeader
          title="Validators"
          config={config}
          selectNodeHandler={handleSelectNode}
        />
        <Divider my={8} />
        <SimpleGrid columns={2} minChildWidth="600px">
          <ValidatorsAbout />
          <ValidatorsActive
            config={config}
            minersList={validators.minersList}
            selectedNode={validators.selectedNode}
          />
          <ValidatorsPropose
            config={config}
            selectedNode={validators.selectedNode}
          />
          <ValidatorsPending
            config={config}
            pendingList={validators.pendingList}
            selectedNode={validators.selectedNode}
          />
        </SimpleGrid>
      </Container>
    </>
  );
}
