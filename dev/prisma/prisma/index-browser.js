
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal
} = require('./runtime/index-browser')


const Prisma = {}

exports.Prisma = Prisma

/**
 * Prisma Client JS version: 3.15.2
 * Query Engine version: 461d6a05159055555eb7dfb337c9fb271cbd4d7e
 */
Prisma.prismaVersion = {
  client: "3.15.2",
  engine: "461d6a05159055555eb7dfb337c9fb271cbd4d7e"
}

Prisma.PrismaClientKnownRequestError = () => {
  throw new Error(`PrismaClientKnownRequestError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  throw new Error(`PrismaClientUnknownRequestError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientRustPanicError = () => {
  throw new Error(`PrismaClientRustPanicError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientInitializationError = () => {
  throw new Error(`PrismaClientInitializationError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientValidationError = () => {
  throw new Error(`PrismaClientValidationError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  throw new Error(`sqltag is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.empty = () => {
  throw new Error(`empty is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.join = () => {
  throw new Error(`join is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.raw = () => {
  throw new Error(`raw is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.validator = () => (val) => val

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = 'DbNull'
Prisma.JsonNull = 'JsonNull'
Prisma.AnyNull = 'AnyNull'

/**
 * Enums
 */
// Based on
// https://github.com/microsoft/TypeScript/issues/3192#issuecomment-261720275
function makeEnum(x) { return x; }

exports.Prisma.MemberScalarFieldEnum = makeEnum({
  username: 'username'
});

exports.Prisma.RoleScalarFieldEnum = makeEnum({
  username: 'username',
  shopId: 'shopId',
  job_type: 'job_type',
  permissions: 'permissions'
});

exports.Prisma.ProductScalarFieldEnum = makeEnum({
  id: 'id',
  name: 'name',
  shopId: 'shopId',
  category: 'category',
  rate: 'rate',
  description: 'description'
});

exports.Prisma.ShopScalarFieldEnum = makeEnum({
  id: 'id',
  name: 'name',
  status: 'status',
  shop_founder: 'shop_founder',
  rate: 'rate',
  description: 'description'
});

exports.Prisma.ShopOwnerScalarFieldEnum = makeEnum({
  username: 'username',
  shopId: 'shopId'
});

exports.Prisma.ShopManagerScalarFieldEnum = makeEnum({
  username: 'username',
  shopId: 'shopId'
});

exports.Prisma.ProductInShopScalarFieldEnum = makeEnum({
  shopId: 'shopId',
  productId: 'productId',
  product_quantity: 'product_quantity'
});

exports.Prisma.ShoppingCartScalarFieldEnum = makeEnum({
  username: 'username'
});

exports.Prisma.ShoppingBagScalarFieldEnum = makeEnum({
  username: 'username',
  shopId: 'shopId'
});

exports.Prisma.ProductInBagScalarFieldEnum = makeEnum({
  username: 'username',
  shopId: 'shopId',
  productId: 'productId',
  product_quantity: 'product_quantity'
});

exports.Prisma.MemberCredentialsScalarFieldEnum = makeEnum({
  username: 'username',
  password: 'password'
});

exports.Prisma.MessageScalarFieldEnum = makeEnum({
  id: 'id',
  timestamp: 'timestamp',
  isRead: 'isRead',
  messageType: 'messageType'
});

exports.Prisma.MessageRecipientsScalarFieldEnum = makeEnum({
  messageId: 'messageId',
  username: 'username'
});

exports.Prisma.DiscountScalarFieldEnum = makeEnum({
  id: 'id',
  shopId: 'shopId',
  kind: 'kind'
});

exports.Prisma.SimpleDiscountScalarFieldEnum = makeEnum({
  id: 'id',
  shopId: 'shopId',
  discountType: 'discountType',
  discountPercent: 'discountPercent',
  description: 'description',
  productId: 'productId',
  category: 'category'
});

exports.Prisma.ConditionalDiscountScalarFieldEnum = makeEnum({
  id: 'id',
  shopId: 'shopId',
  simpleId: 'simpleId',
  simpleShopId: 'simpleShopId'
});

exports.Prisma.DiscountPredicateScalarFieldEnum = makeEnum({
  discountId: 'discountId',
  shopId: 'shopId',
  discountType: 'discountType',
  relation: 'relation',
  value: 'value',
  description: 'description',
  productId: 'productId',
  category: 'category'
});

exports.Prisma.DiscountContainerScalarFieldEnum = makeEnum({
  id: 'id',
  shopId: 'shopId',
  description: 'description',
  type: 'type'
});

exports.Prisma.DiscountInContainerScalarFieldEnum = makeEnum({
  containedDiscount: 'containedDiscount',
  shopId: 'shopId',
  containingDiscount: 'containingDiscount'
});

exports.Prisma.PolicyScalarFieldEnum = makeEnum({
  id: 'id',
  shopId: 'shopId'
});

exports.Prisma.SimplePolicyScalarFieldEnum = makeEnum({
  id: 'id',
  shopId: 'shopId',
  okay: 'okay',
  message: 'message'
});

exports.Prisma.ConditionalPolicyScalarFieldEnum = makeEnum({
  id: 'id',
  shopId: 'shopId',
  dependent: 'dependent',
  dependentShopId: 'dependentShopId',
  dependentOn: 'dependentOn',
  dependentOnShopId: 'dependentOnShopId',
  description: 'description'
});

exports.Prisma.PolicyPredicateScalarFieldEnum = makeEnum({
  policyId: 'policyId',
  shopId: 'shopId',
  policyType: 'policyType',
  relation: 'relation',
  value: 'value',
  description: 'description',
  productId: 'productId',
  productCategory: 'productCategory',
  guest: 'guest'
});

exports.Prisma.LogicalPolicyScalarFieldEnum = makeEnum({
  id: 'id',
  shopId: 'shopId',
  description: 'description',
  purchasePoliciesRelation: 'purchasePoliciesRelation'
});

exports.Prisma.PolicyInContainerScalarFieldEnum = makeEnum({
  containedPolicy: 'containedPolicy',
  shopId: 'shopId',
  containingPolicy: 'containingPolicy'
});

exports.Prisma.OfferScalarFieldEnum = makeEnum({
  id: 'id',
  username: 'username',
  shopId: 'shopId',
  productId: 'productId',
  price: 'price'
});

exports.Prisma.OfferApproverScalarFieldEnum = makeEnum({
  username: 'username',
  offerId: 'offerId',
  answered: 'answered',
  approved: 'approved'
});

exports.Prisma.AppointmentScalarFieldEnum = makeEnum({
  username: 'username',
  shopId: 'shopId',
  assigner: 'assigner'
});

exports.Prisma.AppointmentAgreementScalarFieldEnum = makeEnum({
  username: 'username',
  shopId: 'shopId',
  approver: 'approver',
  answered: 'answered',
  approved: 'approved'
});

exports.Prisma.SortOrder = makeEnum({
  asc: 'asc',
  desc: 'desc'
});

exports.Prisma.QueryMode = makeEnum({
  default: 'default',
  insensitive: 'insensitive'
});
exports.JobType = makeEnum({
  Admin: 'Admin',
  Founder: 'Founder',
  Owner: 'Owner',
  Manager: 'Manager'
});

exports.Permissions = makeEnum({
  AddProduct: 'AddProduct',
  RemoveProduct: 'RemoveProduct',
  ModifyProduct: 'ModifyProduct',
  RequestPersonnelInfo: 'RequestPersonnelInfo',
  GetPurchaseHistory: 'GetPurchaseHistory',
  AddShopOwner: 'AddShopOwner',
  AddShopManager: 'AddShopManager',
  AddPermission: 'AddPermission',
  RemovePermission: 'RemovePermission',
  CloseShop: 'CloseShop',
  ReopenShop: 'ReopenShop',
  AdminControl: 'AdminControl',
  AddDiscount: 'AddDiscount',
  RemoveDiscount: 'RemoveDiscount',
  AddPurchasePolicy: 'AddPurchasePolicy',
  RemovePurchasePolicy: 'RemovePurchasePolicy',
  ShopOwner: 'ShopOwner'
});

exports.ProductCategory = makeEnum({
  A: 'A',
  B: 'B',
  C: 'C'
});

exports.ProductRate = makeEnum({
  NotRated: 'NotRated'
});

exports.ShopStatus = makeEnum({
  Open: 'Open',
  Closed: 'Closed'
});

exports.ShopRate = makeEnum({
  NotRated: 'NotRated'
});

exports.MessageType = makeEnum({
  Simple: 'Simple',
  ShopPurchase: 'ShopPurchase',
  ShopStatusChanged: 'ShopStatusChanged',
  AddedNewOffer2Shop: 'AddedNewOffer2Shop',
  CounterOffer: 'CounterOffer'
});

exports.DiscountKinds = makeEnum({
  SimpleDiscount: 'SimpleDiscount',
  ConditionalDiscount: 'ConditionalDiscount',
  ContainerDiscount: 'ContainerDiscount'
});

exports.DiscountType = makeEnum({
  Product: 'Product',
  Category: 'Category',
  Bag: 'Bag'
});

exports.RelationType = makeEnum({
  LessThan: 'LessThan',
  LessThanOrEqual: 'LessThanOrEqual',
  Equal: 'Equal',
  GreaterThan: 'GreaterThan',
  GreaterThanOrEqual: 'GreaterThanOrEqual',
  NotEqual: 'NotEqual'
});

exports.DiscountRelation = makeEnum({
  And: 'And',
  Or: 'Or',
  Xor: 'Xor',
  Addition: 'Addition',
  Max: 'Max'
});

exports.SimplePolicyType = makeEnum({
  Product: 'Product',
  Category: 'Category',
  ShoppingBag: 'ShoppingBag',
  UserInfo: 'UserInfo'
});

exports.PurchasePoliciesRelation = makeEnum({
  And: 'And',
  Conditional: 'Conditional',
  Or: 'Or'
});

exports.Prisma.ModelName = makeEnum({
  Member: 'Member',
  Role: 'Role',
  Product: 'Product',
  Shop: 'Shop',
  ShopOwner: 'ShopOwner',
  ShopManager: 'ShopManager',
  ProductInShop: 'ProductInShop',
  ShoppingCart: 'ShoppingCart',
  ShoppingBag: 'ShoppingBag',
  ProductInBag: 'ProductInBag',
  MemberCredentials: 'MemberCredentials',
  Message: 'Message',
  MessageRecipients: 'MessageRecipients',
  Discount: 'Discount',
  SimpleDiscount: 'SimpleDiscount',
  ConditionalDiscount: 'ConditionalDiscount',
  DiscountPredicate: 'DiscountPredicate',
  DiscountContainer: 'DiscountContainer',
  DiscountInContainer: 'DiscountInContainer',
  Policy: 'Policy',
  SimplePolicy: 'SimplePolicy',
  ConditionalPolicy: 'ConditionalPolicy',
  PolicyPredicate: 'PolicyPredicate',
  LogicalPolicy: 'LogicalPolicy',
  PolicyInContainer: 'PolicyInContainer',
  Offer: 'Offer',
  OfferApprover: 'OfferApprover',
  Appointment: 'Appointment',
  AppointmentAgreement: 'AppointmentAgreement'
});

/**
 * Create the Client
 */
class PrismaClient {
  constructor() {
    throw new Error(
      `PrismaClient is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
    )
  }
}
exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
