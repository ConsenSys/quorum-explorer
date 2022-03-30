import { useEffect, useState } from "react";
import {
  FormControl,
  FormLabel,
  Button,
  useToast,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Input,
  Flex,
  Text,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  HStack,
} from "@chakra-ui/react";
//@ts-ignore
import { QuorumConfig } from "../../types/QuorumConfig";
import { CompiledContract } from "../../types/Contracts";
import { getDetailsByNodeName, getPrivateKey } from "../../api/quorumConfig";
import axios from "axios";

interface IProps {
  config: QuorumConfig;
  selectedNode: string;
  compiledContract: CompiledContract;
  contractAddress: string;
  account: string;
  setGetValue: any;
  privateFor: string[];
  privateFrom: string;
  fromPrivateKey: string;
}

export default function ContractsInteract(props: IProps) {
  const toast = useToast();
  const [contractAddress, setContractAddress] = useState(props.contractAddress);
  const [readButtonLoading, setReadButtonLoading] = useState(false);
  const [writeValue, setWriteValue] = useState("0");
  const [writeButtonLoading, setWriteButtonLoading] = useState(false);

  useEffect(() => {
    setContractAddress(props.contractAddress);
  }, [props.contractAddress]);

  const handleContractAddress = (e: any) => {
    setContractAddress(e.target.value);
  };

  const handleWriteValue = (e: any) => {
    // setWriteValue(e.target.value);
    setWriteValue(e);
  };

  const handleRead = async (e: any) => {
    e.preventDefault();
    setReadButtonLoading(true);
    const needle = getDetailsByNodeName(props.config, props.selectedNode);
    console.log(contractAddress);
    await axios({
      method: "POST",
      url: "/api/contractRead",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        client: needle.client,
        rpcUrl: needle.rpcUrl,
        privateUrl: needle.privateTxUrl,
        contractAddress: contractAddress,
        compiledContract: props.compiledContract,
        privateFrom: props.privateFrom,
        privateFor: props.privateFor,
        fromPrivateKey: props.fromPrivateKey,
      }),
    })
      .then((result) => {
        console.log("?????>>>>>>");
        console.log(result);
        props.setGetValue(result.data);
      })
      .catch((e) => {
        toast({
          title: "Error!",
          description: `There was an error reading from the contract.`,
          status: "error",
          duration: 5000,
          position: "bottom",
          isClosable: true,
        });
        // const joined = logs.concat(
        //   "Error in deploying contract: " + selectedContract
        // );
        // setLogs(joined);
      });
    setReadButtonLoading(false);
  };

  const handleWrite = async (e: any) => {
    e.preventDefault();
    setWriteButtonLoading(true);
    console.log("WRITE VALUE");
    const needle = getDetailsByNodeName(props.config, props.selectedNode);
    await axios({
      method: "POST",
      url: "/api/contractSet",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        client: needle.client,
        rpcUrl: needle.rpcUrl,
        privateUrl: needle.privateTxUrl,
        contractAddress: contractAddress,
        compiledContract: props.compiledContract,
        value: parseInt(writeValue),
        sender: props.account,
        privateFor: props.privateFor,
      }),
    })
      .then((result) => {
        console.log(result);
        toast({
          title: "Success!",
          description: `Contract set function called successfully.`,
          status: "success",
          duration: 5000,
          position: "bottom",
          isClosable: true,
        });
      })
      .catch((err) => {
        toast({
          title: "Error!",
          description: `${err}`,
          status: "error",
          duration: 5000,
          position: "bottom",
          isClosable: true,
        });
      });
    setWriteButtonLoading(false);
  };

  return (
    <>
      <AccordionItem>
        <AccordionButton>
          <Box color="purple.400" fontWeight="bold" flex="1" textAlign="left">
            3. Interact
          </Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel pb={4}>
          <FormControl>
            <FormLabel htmlFor="contract-address">
              Deployed Contract Address
            </FormLabel>
            <Input
              id="contract-address"
              placeholder="0x"
              value={contractAddress}
              onChange={handleContractAddress}
              isDisabled
            />
          </FormControl>
          <Flex justifyContent="space-between" alignItems="center" m={1}>
            <Text fontWeight="semibold">get</Text>
            <Button
              type="submit"
              backgroundColor="orange.200"
              isLoading={readButtonLoading}
              onClick={handleRead}
              loadingText="Reading"
              variant="solid"
            >
              Read
            </Button>
          </Flex>
          <Flex justifyContent="space-between" alignItems="center" m={1}>
            <FormLabel htmlFor="set" fontWeight="semibold" m={0} mr={5}>
              set
            </FormLabel>
            <HStack>
              <NumberInput
                maxW={120}
                size="sm"
                defaultValue={writeValue}
                onChange={handleWriteValue}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {/* <Input
              id="write-value"
              placeholder=""
              value={writeValue}
              onChange={handleWriteValue}
              size="sm"
            /> */}
              <Button
                type="submit"
                backgroundColor="green.200"
                isLoading={writeButtonLoading}
                onClick={handleWrite}
                loadingText="Writing"
                variant="solid"
                ml={5}
              >
                Transact
              </Button>
            </HStack>
          </Flex>
          <Flex justifyContent="space-between" alignItems="center" m={1}>
            <Text fontWeight="semibold">storedData</Text>
            <Button>Write</Button>
          </Flex>
        </AccordionPanel>
      </AccordionItem>
    </>
  );
}
