import { useState } from "react";
import { Container, SimpleGrid } from "@chakra-ui/react";
import PageHeader from "../common/components/Misc/PageHeader";
import WalletsTransferEth from "../common/components/Wallets/WalletsTransferEth";
import { QuorumConfig, QuorumNode } from "../common/types/QuorumConfig";
import axios from "axios";

interface IState {
  selectedNode: string;
}

interface IProps {
  config: QuorumConfig;
}

export default function Wallets(props: IProps) {
  const [wallet, setWallet] = useState<IState>({
    selectedNode: props.config.nodes[0].name,
  });

  const handleSelectNode = (e: any) => {
    setWallet({ ...wallet, selectedNode: e.target.value });
  };

  return (
    <>
      <Container maxW={{ base: "container.sm", md: "container.xl" }}>
        <PageHeader
          title="Wallets"
          config={props.config}
          selectNodeHandler={handleSelectNode}
        />
        <SimpleGrid columns={1} minChildWidth="300px">
          <WalletsTransferEth
            config={props.config}
            selectedNode={wallet.selectedNode}
          />
        </SimpleGrid>
      </Container>
    </>
  );
}

Wallets.getInitialProps = async () => {
  const res = await axios.get(`${process.env.QE_BACKEND_URL}/api/configGet`);
  return { config: res.data };
};