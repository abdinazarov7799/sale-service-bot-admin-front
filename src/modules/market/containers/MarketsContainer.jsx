import Pagination from "../../../components/pagination/index.jsx";
import React, {useState} from "react";
import {get, isArray, isEmpty} from "lodash";
import {useTranslation} from "react-i18next";
import {
    Box,
    Button,
    Flex,
    Heading,
    useDisclosure,
    TableContainer,
    Table,
    Thead,
    Tr,
    Th,
    Tbody,
    Td,
    Tfoot,
    Input,
    InputRightElement,
    InputGroup,
    ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Modal, IconButton,
} from "@chakra-ui/react";
import {AiOutlineEdit, AiOutlinePlus} from "react-icons/ai";
import {CreateItem} from "../../../components/CreateItem.jsx";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import {OverlayLoader} from "../../../components/loader/index.js";
import {UpdateItem} from "../../../components/UpdateItem.jsx";
import usePaginateQuery from "../../../hooks/api/usePaginateQuery.js";
import {FaSearch} from "react-icons/fa";


const MarketsContainer = () => {
    const { t } = useTranslation();
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [itemData, setItemData] = useState(null);
    const [key,setKey] = useState();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen:updateIsOpen, onOpen:updateOnOpen, onClose:updateOnClose } = useDisclosure();
    const {data,isLoading,isFetching,refetch} = usePaginateQuery({
        key: KEYS.market_get_all,
        url: URLS.market_get_all,
        params: {
            params: {
                size,
                name: key
            }
        },
        page
    });
    const headData = get(data,'data.data',{});

    return(
        <>
            <Box bg={'white'} p={4} width="100%" borderRadius="md">
                <Flex alignItems={"center"}>
                    <Heading mr={4}>{t('Markets')}</Heading>
                    <Button
                        variant='outline'
                        colorScheme={'blue'}
                        leftIcon={<AiOutlinePlus />}
                        onClick={onOpen}
                    >
                        {t("New market")}
                    </Button>
                    <CreateItem
                        isOpen={isOpen}
                        onClose={onClose}
                        refetch={refetch}
                        title={'Create new market'}
                        url={URLS.market_add}
                    />
                </Flex>

                <InputGroup mt={3} mb={4}>
                    <Input
                        placeholder={t("Search")}
                        type={"text"}
                        onChange={(e) => setKey(e.target.value)}
                    />
                    <InputRightElement children={<FaSearch />} />
                </InputGroup>

                <TableContainer mt={6}>
                    {isLoading && <OverlayLoader />}
                    <Table colorScheme="gray" size={"sm"} >
                        <Thead>
                            <Tr>
                                <Th>{t("name UZ")}</Th>
                                <Th>{t("name RU")}</Th>
                                <Th>{t("Edit")}</Th>
                            </Tr>

                        </Thead>
                        {
                            (isEmpty(get(headData,'content',[])) && isArray(get(headData,'content',[]))) ? (
                                <span style={{ padding: "10px", margin: "10px", textAlign: "center" }}>
                                    {t("No Data")}
                                </span>
                            ) : (
                                <Tbody>
                                    {get(headData, "content", []).map((item, i) => (
                                        <Tr
                                            key={i + 1}
                                            _hover={{backgroundColor: '#f3f3f3'}}
                                            cursor={"pointer"}
                                        >
                                            <Td>{get(item, "nameUz", "-")}</Td>
                                            <Td>{get(item, "nameRu", "-")}</Td>
                                            <Td><IconButton icon={<AiOutlineEdit />}  onClick={() => {
                                                setItemData(item)
                                                updateOnOpen()
                                            }} /></Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            )}
                        <Tfoot />
                    </Table>
                </TableContainer>
                <Pagination
                    setPage={setPage}
                    pageCount={get(headData, "totalPages", 1)}
                    page={page}
                />
            </Box>
            <Modal
                isOpen={updateIsOpen}
                onClose={updateOnClose}
                size={{base: 'sm', md: 'xl'}}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{t("Edit market")}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <UpdateItem
                            itemData={itemData}
                            listKeyId={KEYS.market_get_all}
                            url={URLS.market_edit}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={updateOnClose}>
                            {t('Back')}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}
export default MarketsContainer
