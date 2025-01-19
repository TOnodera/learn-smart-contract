// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// スマートコントラクトにRBACを追加する
import "@openzeppelin/contracts/access/AccessControl.sol";
// NFTにメタ情報格納先URIを返却する機能を提供する
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
// 所有者ごとのtokenIdを返却する機能を提供する
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract MyERC721 is ERC721URIStorage, ERC721Enumerable, AccessControl {
    // @dev tokenIdを自動インクリメントするためのカウンター
    uint256 private _tokenIdCounter;
    // @dev このNFTを作成できる権限を表す定数
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    /**
     * コンストラクタ
     * MINTER_ROLEとDEFAULT_ADMIN_ROLEにNTFを作成できる権限を付与
     */
    constructor(
        // NFTの名前
        string memory _name,
        // NFTのトークンのシンボル
        string memory _symbol
    ) ERC721(_name, _symbol) {
        _grantRole(MINTER_ROLE, _msgSender());
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }

    /**
     * @dev NFTを作成する関数
     * @param {address} to 受取先
     * @param {string} _tokenURI token情報が格納されるjsonのURI
     */
    function safeMint(
        address to,
        string memory _tokenURI
    ) public onlyRole(MINTER_ROLE) returns (uint256) {
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter += 1;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, _tokenURI);
        return tokenId;
    }

    /**
     * NFTのmetadataを示すjsonのURIを返す
     */
    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    /**
     * OpenZeppelin ERC721で提供されてるhook
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    /**
     * NFTをburn(焼却)する
     */
    function _burn(
        uint256 tokenId
    ) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    /**
     * 特定の引退フェースを実装してるか確認してくれる
     */
    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        virtual
        override(AccessControl, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
