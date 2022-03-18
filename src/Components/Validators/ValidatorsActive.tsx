import {
  Heading,
  Flex,
  Text,
  Button,
  Spacer,
  Box,
  Center,
  Skeleton,
} from "@chakra-ui/react";
import { useState } from "react";
import { QuorumConfig, QuorumNode } from "../Types/QuorumConfig";
import { proposeValidator } from "../../API/Validators";
import { getDetailsByNodeName } from "../../API/QuorumConfig";
import { buttonState } from "../Types/Validator";
import { motion } from "framer-motion";

const MotionBox = motion(Box);
interface IProps {
  config: QuorumConfig;
  minersList: string[];
  selectedNode: string;
}

export default function ValidatorsActive(props: IProps) {
  const [buttonLoading, setButtonLoading] = useState<buttonState>({});
  const handleClick = async (e: any, index: number) => {
    console.log(e);
    setButtonLoading({ [index]: true });
    await new Promise((r) => setTimeout(r, 1000));
    const needle: QuorumNode = getDetailsByNodeName(
      props.config,
      props.selectedNode
    );
    const rpcUrl: string = needle.rpcUrl;
    const client: string = needle.client;
    const removeValidator = await proposeValidator(
      rpcUrl,
      client,
      props.config.algorithm,
      e,
      false
    );
    if (removeValidator === 200) {
      console.log("Proposal to remove initiated: " + e);
    }
    setButtonLoading({ [index]: false });
  };

  return (
    <>
      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        borderRadius="lg"
        borderWidth={2}
        p={5}
        mx={2}
        my={3}
      >
        <Center mb={5}>
          <Heading size="lg">Active Validators</Heading>
        </Center>
        {props.minersList.length > 0 ? (
          props.minersList.map((miner, i) => {
            return (
              <>
                <Flex m={3} justifyContent="center" alignItems="center">
                  <Text>{miner}</Text>
                  <Spacer key={i} />
                  <Button
                    isLoading={buttonLoading[i] ? true : false}
                    loadingText="Removing..."
                    onClick={() => handleClick(miner, i)}
                  >
                    Remove Validator
                  </Button>
                </Flex>
              </>
            );
          })
        ) : (
          <>
            <Skeleton h="20px" m={2} />
            <Skeleton h="20px" m={2} />
            <Skeleton h="20px" m={2} />
            <Skeleton h="20px" m={2} />
            <Skeleton h="20px" m={2} />
            <Skeleton h="20px" m={2} />
            <Skeleton h="20px" m={2} />
            <Skeleton h="20px" m={2} />
          </>
        )}
      </MotionBox>
    </>
  );
}
