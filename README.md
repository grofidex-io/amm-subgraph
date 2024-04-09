# U2U Subgraph

TheGraph exposes a GraphQL endpoint to query the events and entities within the U2U ecosystem.

Currently, there are multiple subgraphs, but additional subgraphs can be added to this repository, following the current architecture.

## Subgraphs

1. **[Blocks] Tracks all blocks on U2U.

   - U2U https://subgraph-amm-dev.uniultra.xyz/subgraphs/name/u2u-amm/blocks

2. **MasterChef (v3)**: Tracks data for MasterChefV3.

3. **Exchange (v3)**: Tracks all U2Dex Exchange data with price, volume, liquidity

    - U2U https://subgraph-amm-dev.uniultra.xyz/subgraphs/name/u2u-amm/u2dex-v1

## Dependencies

- [Graph CLI](https://github.com/graphprotocol/graph-cli)
  - Required to generate and build local GraphQL dependencies.

```shell
yarn global add @graphprotocol/graph-cli
```

## Deployment

For any of the subgraph: `blocks` as `[subgraph]`

1. Run the `cd subgraphs/[subgraph]` command to move to the subgraph directory.

2. Run the `yarn codegen` command to prepare the TypeScript sources for the GraphQL (generated/\*).

3. Run the `yarn build` command to build the subgraph, and check compilation errors before deploying.

4. Run `graph auth --product hosted-service '<ACCESS_TOKEN>'`

5. Deploy via `yarn deploy`.
