-- CreateEnum
CREATE TYPE "JobType" AS ENUM ('Admin', 'Founder', 'Owner', 'Manager');

-- CreateEnum
CREATE TYPE "Permissions" AS ENUM ('AddProduct', 'RemoveProduct', 'ModifyProduct', 'RequestPersonnelInfo', 'GetPurchaseHistory', 'AddShopOwner', 'AddShopManager', 'AddPermission', 'RemovePermission', 'CloseShop', 'ReopenShop', 'AdminControl', 'AddDiscount', 'RemoveDiscount', 'AddPurchasePolicy', 'RemovePurchasePolicy', 'ShopOwner');

-- CreateEnum
CREATE TYPE "ProductCategory" AS ENUM ('A', 'B', 'C');

-- CreateEnum
CREATE TYPE "ProductRate" AS ENUM ('NotRated');

-- CreateEnum
CREATE TYPE "ShopStatus" AS ENUM ('Open', 'Closed');

-- CreateEnum
CREATE TYPE "ShopRate" AS ENUM ('NotRated');

-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('Product', 'Category', 'Bag');

-- CreateEnum
CREATE TYPE "RelationType" AS ENUM ('LessThan', 'LessThanOrEqual', 'Equal', 'GreaterThan', 'GreaterThanOrEqual', 'NotEqual');

-- CreateEnum
CREATE TYPE "DiscountRelation" AS ENUM ('And', 'Or', 'Xor', 'Addition', 'Max');

-- CreateEnum
CREATE TYPE "SimplePolicyType" AS ENUM ('Product', 'Category', 'ShoppingBag', 'UserInfo');

-- CreateEnum
CREATE TYPE "PurchasePoliciesRelation" AS ENUM ('And', 'Conditional', 'Or');

-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('Simple', 'ShopPurchase', 'ShopStatusChanged', 'AddedNewOffer2Shop', 'CounterOffer');

-- CreateEnum
CREATE TYPE "DiscountKinds" AS ENUM ('SimpleDiscount', 'ConditionalDiscount', 'ContainerDiscount');

-- CreateTable
CREATE TABLE "member" (
    "username" TEXT NOT NULL,

    CONSTRAINT "member_pkey" PRIMARY KEY ("username")
);

-- CreateTable
CREATE TABLE "role" (
    "username" TEXT NOT NULL,
    "shopId" INTEGER NOT NULL,
    "job_type" "JobType" NOT NULL,
    "permissions" "Permissions"[],

    CONSTRAINT "role_pkey" PRIMARY KEY ("username","shopId")
);

-- CreateTable
CREATE TABLE "product" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "shopId" INTEGER NOT NULL,
    "category" "ProductCategory" NOT NULL DEFAULT E'A',
    "rate" "ProductRate" NOT NULL DEFAULT E'NotRated',
    "description" TEXT,

    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shop" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "status" "ShopStatus" NOT NULL,
    "shop_founder" TEXT NOT NULL,
    "rate" "ShopRate" NOT NULL DEFAULT E'NotRated',
    "description" TEXT,

    CONSTRAINT "shop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shop_owner" (
    "username" TEXT NOT NULL,
    "shopId" INTEGER NOT NULL,

    CONSTRAINT "shop_owner_pkey" PRIMARY KEY ("username","shopId")
);

-- CreateTable
CREATE TABLE "shop_manager" (
    "username" TEXT NOT NULL,
    "shopId" INTEGER NOT NULL,

    CONSTRAINT "shop_manager_pkey" PRIMARY KEY ("username","shopId")
);

-- CreateTable
CREATE TABLE "product_in_shop" (
    "shopId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "product_quantity" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "product_in_shop_pkey" PRIMARY KEY ("shopId","productId")
);

-- CreateTable
CREATE TABLE "shopping_cart" (
    "username" TEXT NOT NULL,

    CONSTRAINT "shopping_cart_pkey" PRIMARY KEY ("username")
);

-- CreateTable
CREATE TABLE "shopping_bag" (
    "username" TEXT NOT NULL,
    "shopId" INTEGER NOT NULL,

    CONSTRAINT "shopping_bag_pkey" PRIMARY KEY ("username","shopId")
);

-- CreateTable
CREATE TABLE "product_in_bag" (
    "username" TEXT NOT NULL,
    "shopId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "product_quantity" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "product_in_bag_pkey" PRIMARY KEY ("username","shopId","productId")
);

-- CreateTable
CREATE TABLE "member_credentials" (
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "member_credentials_pkey" PRIMARY KEY ("username")
);

-- CreateTable
CREATE TABLE "message" (
    "id" INTEGER NOT NULL,
    "timestamp" INTEGER NOT NULL,
    "isRead" BOOLEAN NOT NULL,
    "messageType" "MessageType" NOT NULL,

    CONSTRAINT "message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message_recipients" (
    "messageId" INTEGER NOT NULL,
    "username" TEXT NOT NULL,

    CONSTRAINT "message_recipients_pkey" PRIMARY KEY ("messageId","username")
);

-- CreateTable
CREATE TABLE "discount" (
    "id" INTEGER NOT NULL,
    "shopId" INTEGER NOT NULL,
    "kind" "DiscountKinds" NOT NULL,

    CONSTRAINT "discount_pkey" PRIMARY KEY ("id","shopId")
);

-- CreateTable
CREATE TABLE "simple_discount" (
    "id" INTEGER NOT NULL,
    "shopId" INTEGER NOT NULL,
    "discountType" "DiscountType" NOT NULL,
    "discountPercent" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "productId" INTEGER,
    "category" "ProductCategory",

    CONSTRAINT "simple_discount_pkey" PRIMARY KEY ("id","shopId")
);

-- CreateTable
CREATE TABLE "conditional_discount" (
    "id" INTEGER NOT NULL,
    "shopId" INTEGER NOT NULL,
    "simpleId" INTEGER NOT NULL,
    "simpleShopId" INTEGER NOT NULL,

    CONSTRAINT "conditional_discount_pkey" PRIMARY KEY ("id","shopId")
);

-- CreateTable
CREATE TABLE "discount_predicate" (
    "discountId" INTEGER NOT NULL,
    "shopId" INTEGER NOT NULL,
    "discountType" "DiscountType" NOT NULL,
    "relation" "RelationType" NOT NULL,
    "value" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "productId" INTEGER,
    "category" "ProductCategory",

    CONSTRAINT "discount_predicate_pkey" PRIMARY KEY ("discountId","shopId")
);

-- CreateTable
CREATE TABLE "discount_container" (
    "id" INTEGER NOT NULL,
    "shopId" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "type" "DiscountRelation" NOT NULL,

    CONSTRAINT "discount_container_pkey" PRIMARY KEY ("id","shopId")
);

-- CreateTable
CREATE TABLE "discount_in_container" (
    "containedDiscount" INTEGER NOT NULL,
    "shopId" INTEGER NOT NULL,
    "containingDiscount" INTEGER NOT NULL,

    CONSTRAINT "discount_in_container_pkey" PRIMARY KEY ("containedDiscount","containingDiscount","shopId")
);

-- CreateTable
CREATE TABLE "policy" (
    "id" INTEGER NOT NULL,
    "shopId" INTEGER NOT NULL,

    CONSTRAINT "policy_pkey" PRIMARY KEY ("id","shopId")
);

-- CreateTable
CREATE TABLE "simple_policy" (
    "id" INTEGER NOT NULL,
    "shopId" INTEGER NOT NULL,
    "okay" BOOLEAN NOT NULL,
    "message" TEXT NOT NULL,

    CONSTRAINT "simple_policy_pkey" PRIMARY KEY ("id","shopId")
);

-- CreateTable
CREATE TABLE "conditional_policy" (
    "id" INTEGER NOT NULL,
    "shopId" INTEGER NOT NULL,
    "dependent" INTEGER NOT NULL,
    "dependentShopId" INTEGER NOT NULL,
    "dependentOn" INTEGER NOT NULL,
    "dependentOnShopId" INTEGER NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "conditional_policy_pkey" PRIMARY KEY ("id","shopId")
);

-- CreateTable
CREATE TABLE "policy_predicate" (
    "policyId" INTEGER NOT NULL,
    "shopId" INTEGER NOT NULL,
    "policyType" "SimplePolicyType" NOT NULL,
    "relation" "RelationType" NOT NULL,
    "value" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "productId" INTEGER,
    "productCategory" "ProductCategory",
    "guest" TEXT,

    CONSTRAINT "policy_predicate_pkey" PRIMARY KEY ("policyId","shopId")
);

-- CreateTable
CREATE TABLE "logical_policy" (
    "id" INTEGER NOT NULL,
    "shopId" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "purchasePoliciesRelation" "PurchasePoliciesRelation" NOT NULL,

    CONSTRAINT "logical_policy_pkey" PRIMARY KEY ("id","shopId")
);

-- CreateTable
CREATE TABLE "policy_in_container" (
    "containedPolicy" INTEGER NOT NULL,
    "shopId" INTEGER NOT NULL,
    "containingPolicy" INTEGER NOT NULL,

    CONSTRAINT "policy_in_container_pkey" PRIMARY KEY ("containedPolicy","containingPolicy","shopId")
);

-- CreateTable
CREATE TABLE "offer" (
    "id" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "shopId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "offer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "offer_approver" (
    "username" TEXT NOT NULL,
    "offerId" INTEGER NOT NULL,
    "answered" BOOLEAN NOT NULL DEFAULT false,
    "approved" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "appointment" (
    "username" TEXT NOT NULL,
    "shopId" INTEGER NOT NULL,
    "assigner" TEXT NOT NULL,

    CONSTRAINT "appointment_pkey" PRIMARY KEY ("username","shopId")
);

-- CreateTable
CREATE TABLE "appointment_agreement" (
    "username" TEXT NOT NULL,
    "shopId" INTEGER NOT NULL,
    "approver" TEXT NOT NULL,
    "answered" BOOLEAN NOT NULL DEFAULT false,
    "approved" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "appointment_agreement_pkey" PRIMARY KEY ("username","shopId")
);

-- CreateIndex
CREATE UNIQUE INDEX "conditional_discount_simpleId_simpleShopId_key" ON "conditional_discount"("simpleId", "simpleShopId");

-- CreateIndex
CREATE UNIQUE INDEX "discount_in_container_containedDiscount_shopId_key" ON "discount_in_container"("containedDiscount", "shopId");

-- CreateIndex
CREATE UNIQUE INDEX "policy_in_container_containedPolicy_shopId_key" ON "policy_in_container"("containedPolicy", "shopId");

-- CreateIndex
CREATE UNIQUE INDEX "offer_approver_offerId_key" ON "offer_approver"("offerId");

-- AddForeignKey
ALTER TABLE "role" ADD CONSTRAINT "role_username_fkey" FOREIGN KEY ("username") REFERENCES "member"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role" ADD CONSTRAINT "role_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "shop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "shop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shop" ADD CONSTRAINT "shop_shop_founder_fkey" FOREIGN KEY ("shop_founder") REFERENCES "member"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shop_owner" ADD CONSTRAINT "shop_owner_username_shopId_fkey" FOREIGN KEY ("username", "shopId") REFERENCES "role"("username", "shopId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shop_manager" ADD CONSTRAINT "shop_manager_username_shopId_fkey" FOREIGN KEY ("username", "shopId") REFERENCES "role"("username", "shopId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_in_shop" ADD CONSTRAINT "product_in_shop_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_in_shop" ADD CONSTRAINT "product_in_shop_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "shop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_cart" ADD CONSTRAINT "shopping_cart_username_fkey" FOREIGN KEY ("username") REFERENCES "member"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_bag" ADD CONSTRAINT "shopping_bag_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "shop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_bag" ADD CONSTRAINT "shopping_bag_username_fkey" FOREIGN KEY ("username") REFERENCES "shopping_cart"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_in_bag" ADD CONSTRAINT "product_in_bag_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_in_bag" ADD CONSTRAINT "product_in_bag_username_shopId_fkey" FOREIGN KEY ("username", "shopId") REFERENCES "shopping_bag"("username", "shopId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_credentials" ADD CONSTRAINT "member_credentials_username_fkey" FOREIGN KEY ("username") REFERENCES "member"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_recipients" ADD CONSTRAINT "message_recipients_username_fkey" FOREIGN KEY ("username") REFERENCES "member"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_recipients" ADD CONSTRAINT "message_recipients_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discount" ADD CONSTRAINT "discount_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "shop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simple_discount" ADD CONSTRAINT "simple_discount_id_shopId_fkey" FOREIGN KEY ("id", "shopId") REFERENCES "discount"("id", "shopId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conditional_discount" ADD CONSTRAINT "conditional_discount_id_shopId_fkey" FOREIGN KEY ("id", "shopId") REFERENCES "discount"("id", "shopId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conditional_discount" ADD CONSTRAINT "conditional_discount_simpleId_simpleShopId_fkey" FOREIGN KEY ("simpleId", "simpleShopId") REFERENCES "simple_discount"("id", "shopId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discount_predicate" ADD CONSTRAINT "discount_predicate_discountId_shopId_fkey" FOREIGN KEY ("discountId", "shopId") REFERENCES "conditional_discount"("id", "shopId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discount_container" ADD CONSTRAINT "discount_container_id_shopId_fkey" FOREIGN KEY ("id", "shopId") REFERENCES "discount"("id", "shopId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discount_in_container" ADD CONSTRAINT "discount_in_container_containedDiscount_shopId_fkey" FOREIGN KEY ("containedDiscount", "shopId") REFERENCES "discount"("id", "shopId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discount_in_container" ADD CONSTRAINT "discount_in_container_containingDiscount_shopId_fkey" FOREIGN KEY ("containingDiscount", "shopId") REFERENCES "discount_container"("id", "shopId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "policy" ADD CONSTRAINT "policy_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "shop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simple_policy" ADD CONSTRAINT "simple_policy_id_shopId_fkey" FOREIGN KEY ("id", "shopId") REFERENCES "policy"("id", "shopId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conditional_policy" ADD CONSTRAINT "conditional_policy_id_shopId_fkey" FOREIGN KEY ("id", "shopId") REFERENCES "policy"("id", "shopId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "policy_predicate" ADD CONSTRAINT "policy_predicate_policyId_shopId_fkey" FOREIGN KEY ("policyId", "shopId") REFERENCES "conditional_policy"("id", "shopId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logical_policy" ADD CONSTRAINT "logical_policy_id_shopId_fkey" FOREIGN KEY ("id", "shopId") REFERENCES "policy"("id", "shopId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "policy_in_container" ADD CONSTRAINT "policy_in_container_containedPolicy_shopId_fkey" FOREIGN KEY ("containedPolicy", "shopId") REFERENCES "policy"("id", "shopId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "policy_in_container" ADD CONSTRAINT "policy_in_container_containingPolicy_shopId_fkey" FOREIGN KEY ("containingPolicy", "shopId") REFERENCES "logical_policy"("id", "shopId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offer" ADD CONSTRAINT "offer_username_fkey" FOREIGN KEY ("username") REFERENCES "member"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offer" ADD CONSTRAINT "offer_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offer" ADD CONSTRAINT "offer_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "shop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offer_approver" ADD CONSTRAINT "offer_approver_username_fkey" FOREIGN KEY ("username") REFERENCES "member"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offer_approver" ADD CONSTRAINT "offer_approver_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "offer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_username_fkey" FOREIGN KEY ("username") REFERENCES "member"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "shop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointment_agreement" ADD CONSTRAINT "appointment_agreement_username_shopId_fkey" FOREIGN KEY ("username", "shopId") REFERENCES "appointment"("username", "shopId") ON DELETE CASCADE ON UPDATE CASCADE;
