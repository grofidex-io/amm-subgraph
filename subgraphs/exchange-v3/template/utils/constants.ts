/* eslint-disable prefer-const */
import { BigInt, BigDecimal, Address } from "@graphprotocol/graph-ts";
import { Factory as FactoryContract } from "../generated/templates/Pool/Factory";

export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
// prettier-ignore
export const FACTORY_ADDRESS = "0xb13b63b880f8c9b39cb68ed3fdfe10f067cf76cb";

export let ZERO_BI = BigInt.fromI32(0);
export let ONE_BI = BigInt.fromI32(1);
export let ZERO_BD = BigDecimal.fromString("0");
export let ONE_BD = BigDecimal.fromString("1");
export let BI_18 = BigInt.fromI32(18);

export let TWO_BD = BigDecimal.fromString("2");

export let factoryContract = FactoryContract.bind(Address.fromString(FACTORY_ADDRESS));
