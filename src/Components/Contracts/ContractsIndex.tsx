import { useState } from "react";
import { QuorumConfig } from "../Types/QuorumConfig";
import CodeEditor from "@uiw/react-textarea-code-editor";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  chakra,
  FormControl,
  FormLabel,
  Button,
  useColorModeValue,
  useToast,
  SimpleGrid,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Input,
  Flex,
  Text,
  Table,
  Thead,
  Tbody,
  Code,
  Tr,
  Th,
  Td,
  TableCaption,
  VStack,
  Divider,
  Select,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  faRocket,
  faCode,
  faStream,
  faPaperPlane,
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { SmartContract, defaultSmartContracts } from "../Types/Contracts";
const MotionGrid = motion(SimpleGrid);
const ChakraCodeArea = chakra(CodeEditor);

interface IProps {
  config: QuorumConfig;
  selectedNode: string;
}

export default function ContractsIndex(props: IProps) {
  const lightMode = "gray.100";
  const darkMode = "gray.200";
  const contracts: SmartContract[] = defaultSmartContracts;
  const codeTextArea = useColorModeValue(lightMode, darkMode);
  const toast = useToast();
  const [code, setCode] = useState(contracts[0].contract);
  const [buttonLoading, setButtonLoading] = useState({
    Compile: { status: false, isDisabled: false },
    Deploy: { status: false, isDisabled: true },
  });

  const ContractCodeHandler = (e: any) => {
    e.preventDefault();
    const needle: SmartContract = contracts.filter(
      (_) => _.name === e.target.value
    )[0];
    setCode(needle.contract);
  };

  const HandleCompile = async (e: any) => {
    e.preventDefault();
    setButtonLoading({
      ...buttonLoading,
      Compile: { status: true, isDisabled: false },
    });
    await new Promise((r) => setTimeout(r, 1000));
    toast({
      title: "Compiled Contract!",
      description: `The contract was successfully compiled. Please check the compiled code tab for details `,
      status: "success",
      duration: 5000,
      position: "bottom",
      isClosable: true,
    });
    console.log(code);
    setButtonLoading({
      Deploy: { status: false, isDisabled: false },
      Compile: { status: false, isDisabled: false },
    });
  };

  const HandleDeploy = async (e: any) => {
    e.preventDefault();
    setButtonLoading({
      ...buttonLoading,
      Deploy: { status: true, isDisabled: false },
    });
    await new Promise((r) => setTimeout(r, 1000));
    toast({
      title: "Deployed Contract!",
      description: `The contract was successfully deployed through ${props.selectedNode} @ address: `,
      status: "success",
      duration: 5000,
      position: "bottom",
      isClosable: true,
    });
    console.log(code);
    setButtonLoading({
      ...buttonLoading,
      Deploy: { status: false, isDisabled: false },
    });
  };

  return (
    <>
      <MotionGrid
        columns={2}
        minChildWidth="400px"
        gap={2}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {/* code and button  */}
        <Box mt={5}>
          <Select size="sm" variant="filled" onChange={ContractCodeHandler}>
            {contracts.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </Select>
          <br />
          <ChakraCodeArea
            id="code"
            value={code}
            language="sol"
            placeholder="Please enter SOL code."
            onChange={(evn) => setCode(evn.target.value)}
            padding={15}
            borderRadius="lg"
            borderWidth={2}
            backgroundColor={codeTextArea}
            fontSize={18}
            boxShadow="2xl"
            mb={10}
          />
          <Button
            leftIcon={<FontAwesomeIcon icon={faRocket as IconProp} />}
            isLoading={buttonLoading.Compile.status}
            isDisabled={buttonLoading.Compile.isDisabled}
            loadingText="Compiling..."
            type="submit"
            variant="solid"
            backgroundColor="orange.200"
            onClick={HandleCompile}
            mr={2}
          >
            Compile
          </Button>
          <Button
            leftIcon={<FontAwesomeIcon icon={faRocket as IconProp} />}
            isLoading={buttonLoading.Deploy.status}
            isDisabled={buttonLoading.Deploy.isDisabled}
            loadingText="Deploying..."
            type="submit"
            variant="solid"
            backgroundColor="green.200"
            onClick={HandleDeploy}
          >
            Deploy
          </Button>
        </Box>

        {/* tabs  */}
        <Box>
          <Tabs mt={5} isFitted isLazy variant="enclosed">
            <TabList mb="1em">
              <Tab>
                <FontAwesomeIcon icon={faPaperPlane as IconProp} />
              </Tab>
              <Tab>
                <FontAwesomeIcon icon={faCode as IconProp} />
              </Tab>
              <Tab>
                <FontAwesomeIcon icon={faStream as IconProp} />
              </Tab>
              <Tab>
                <FontAwesomeIcon icon={faQuestionCircle as IconProp} />
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <SimpleGrid columns={2} minChildWidth="400px" spacing="40px">
                  <Accordion allowMultiple defaultIndex={[0, 1]}>
                    <AccordionItem>
                      <AccordionButton>
                        <Box
                          color="blue.600"
                          fontWeight="bold"
                          flex="1"
                          textAlign="left"
                        >
                          Choose Contract
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                      <AccordionPanel pb={4}>
                        <FormControl isRequired>
                          <FormLabel htmlFor="contract-address">
                            Contract Address
                          </FormLabel>
                          <Input id="contract-address" placeholder="0x" />
                        </FormControl>
                      </AccordionPanel>
                    </AccordionItem>
                    <AccordionItem>
                      <AccordionButton>
                        <Box
                          color="red.400"
                          fontWeight="bold"
                          flex="1"
                          textAlign="left"
                        >
                          Transact
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                      <AccordionPanel pb={4}>
                        <FormControl>
                          <FormLabel htmlFor="from-address">
                            FROM Address
                          </FormLabel>
                          <Input id="from-address" placeholder="0x" />
                          <FormLabel htmlFor="private-for">
                            Private For
                          </FormLabel>
                          <Input id="private-for" placeholder="0x" />
                          <Flex
                            justifyContent="space-between"
                            alignItems="center"
                            m={1}
                          >
                            <Text fontWeight="semibold">get</Text>
                            <Button>Read</Button>
                          </Flex>
                          <Flex
                            justifyContent="space-between"
                            alignItems="center"
                            m={1}
                          >
                            <FormLabel
                              htmlFor="set"
                              fontWeight="semibold"
                              m={0}
                              mr={5}
                            >
                              set
                            </FormLabel>
                            <Input id="set" placeholder="0x" />
                            <Button ml={5}>Transact</Button>
                          </Flex>
                          <Flex
                            justifyContent="space-between"
                            alignItems="center"
                            m={1}
                          >
                            <Text fontWeight="semibold">storedData</Text>
                            <Button>Read</Button>
                          </Flex>
                        </FormControl>
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>
                  <Accordion allowMultiple defaultIndex={[0, 1]}>
                    <AccordionItem>
                      <AccordionButton>
                        <Box
                          color="green.600"
                          fontWeight="bold"
                          flex="1"
                          textAlign="left"
                        >
                          Contract State
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                      <AccordionPanel pb={4}>
                        <Table variant="simple">
                          <TableCaption>Read and Transact Results</TableCaption>
                          <Thead>
                            <Tr>
                              <Th>Result</Th>
                              <Th isNumeric>Value</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            <Tr>
                              <Td>get</Td>
                              <Td isNumeric>0</Td>
                            </Tr>
                            <Tr>
                              <Td>storedData</Td>
                              <Td isNumeric>0</Td>
                            </Tr>
                          </Tbody>
                        </Table>
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>
                </SimpleGrid>
              </TabPanel>

              {/* compiler output */}
              <TabPanel>
                <VStack
                  align="left"
                  divider={<Divider borderColor="gray.200" />}
                  spacing={1}
                >
                  <Code>Using 'SimpleStorage' at 0x881ba7a6</Code>
                  <Code>{`[read] get() => 0`}</Code>
                  <Code>{`[txn] set("1234") => created tx 0xcd362161`}</Code>
                  <Code>{`[read] get() => 0`}</Code>
                  <Code>{`[txn] set("4321") => created tx 0xcd362161`}</Code>
                  <Code>{`[read] get() => 0`}</Code>
                </VStack>
              </TabPanel>

              {/* logs */}
              <TabPanel>
                <VStack
                  align="left"
                  divider={<Divider borderColor="gray.200" />}
                  spacing={1}
                >
                  <Code>Using 'SimpleStorage' at 0x881ba7a6</Code>
                  <Code>{`[read] get() => 0`}</Code>
                  <Code>{`[txn] set("1234") => created tx 0xcd362161`}</Code>
                  <Code>{`[read] get() => 0`}</Code>
                  <Code>{`[txn] set("4321") => created tx 0xcd362161`}</Code>
                  <Code>{`[read] get() => 0`}</Code>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </MotionGrid>
    </>
  );
}
