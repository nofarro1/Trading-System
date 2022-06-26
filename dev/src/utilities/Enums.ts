import {NewProductData} from "./DataObjects";

export enum SearchType{productName, category, keyword}
export enum FilterType{price, productRate, category, shopRate}
export const ShopRate: { [x: string]: 'NotRated'} = {
    NotRated: 'NotRated',
}
export type ShopRate = typeof ShopRate[keyof typeof ShopRate]
export const ProductCategory: { [x: string]: 'A' | 'B' | 'C'} = {
    A: 'A',
    B: 'B',
    C: 'C',
}
export type ProductCategory = typeof ProductCategory[keyof typeof ProductCategory]
export const ProductRate: { [x: string]: 'NotRated'} = {
    NotRated: 'NotRated',
}
export type ProductRate = typeof ProductRate[keyof typeof ProductRate]
export const ShopStatus: { [x: string]: 'Open' | 'Closed'} = {
    Open: 'Open',
    Closed: 'Closed',
}
export type ShopStatus = typeof ShopStatus[keyof typeof ShopStatus]
export enum DiscountType {Product, Category, Bag}
export enum PolicyType {LogicalPolicy, SimplePolicy }
export enum SimplePolicyType {Product, Category, ShoppingBag, UserInfo}
export enum LogicalPolicy {AndPolicy, OrPolicy, ConditionalPolicy}
export const JobType: { [x: string]: 'Admin' | 'Founder' | 'Owner' | 'Manager'} = {
    Admin: 'Admin',
    Founder: 'Founder',
    Owner: 'Owner',
    Manager: 'Manager',
}
export type JobType = typeof JobType[keyof typeof JobType]
export enum RelationType {LessThen, LessThenOrEqual, Equal, GreaterThen, GreaterThenOrEqual, NotEqual }
export enum DiscountKinds {SimpleDiscount, ConditionalDiscount, ContainerDiscount}
export const DiscountRelation: { [x: string]: 'And' | 'Or' | 'Xor' | 'Addition' | 'Max'} = {
    And: 'And',
    Or: 'Or',
    Xor: 'Xor',
    Addition: 'Addition',
    Max: 'Max',
}
export type DiscountRelation = typeof DiscountRelation[keyof typeof DiscountRelation]
export enum PurchasePoliciesKinds {SimplePurchase, ContainerPurchasePolicy}
export enum PurchasePoliciesRelation { And, Conditional, Or}

//
// export function toCategoryEnum(productData: NewProductData) {
//     const str = productData.productCategory;
//     const enumType: ProductCategory = str as unknown as ProductCategory;
//     const cateEnum = ProductCategory[productData[enumType]];
//     console.log(cateEnum);
//     return cateEnum;
//
// }