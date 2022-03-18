
import { Divider, VStack, Flex, Text, Skeleton } from "@chakra-ui/react";
import ExplorerBlockDetails from "./ExplorerBlockDetails";
import { QuorumBlock } from "../Types/Explorer";
import { getSecsAgo, abbreviateValidator } from '../../API/Explorer';

interface IProps {
  block: QuorumBlock;
}

export default function ExplorerBlockCard({ block }: IProps) {
  
  return (
    <>
      <Flex
        alignItems="center"
        justifyContent="center"
        flexDirection={{ base: "column", md: "column" }}
        px={{ base: "5", md: "8" }}
        pt={{ base: "5", md: "4" }}
        pb={{ base: "5", md: "4" }}
        borderRadius="lg"
        borderWidth={2}
        overflow="hidden"
      >
        <VStack>
          {block.statusText !== "error" ? (
            <>
              {" "}
              <Text fontSize="md" as="b">
                {block.number}
                &nbsp;&nbsp;&nbsp;
                <ExplorerBlockDetails block={block} />
              </Text>
              <Divider />
              <Text fontSize="sm" textAlign="left">
              {block.transactions.length} Transactions, {getSecsAgo(block.timestamp)} seconds ago 
              </Text>
              <Text fontSize="sm" align="center">
                Validator: {abbreviateValidator(block.miner)}
              </Text>{" "}
            </>
          ) : (
            <>
              <Skeleton h="20px" w="130px" />
              <Divider />
              <Skeleton h="20px" w="130px" />
              <Skeleton h="20px" w="130px" />
            </>
          )}
        </VStack>
      </Flex>
    </>
  );
}


