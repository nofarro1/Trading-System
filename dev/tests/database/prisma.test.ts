import {PrismaClient, Permissions, ProductCategory, JobType, ProductRate, ShopStatus, ShopRate} from "../../prisma/prisma";

let prisma;

async function createMember(username: string) {
    await prisma.member.create({
        data: {
            username: username,
        },
    });
}

async function createMemberCredentials(username: string, password: string) {
    await prisma.memberCredentials.create({
        data: {
            username: username,
            password: password,
        },
    });
}

async function createRole(username: string, shopId: number, job_type: JobType, permissions: Permissions[], title?: string) {
    await prisma.role.create({
        data: {
            username: username,
            shopId: shopId,
            title: title,
            job_type: job_type,
            permissions: permissions,
        },
    });
}

async function createProduct(id: number, name: string, shopId: number, category: ProductCategory, rate: ProductRate,
                             quantity: number, description?: string) {
    await prisma.product.create({
        data: {
            id: id,
            name: name,
            shopId: shopId,
            category: category,
            rate: rate,
            description: description,
        },
    });

    await createProductsInShop(shopId, id, quantity);
}

async function createShop(id: number, name: string, status: ShopStatus, shop_founder: string, shop_owners: string[],
                          shop_managers: string[], rate: ShopRate, /* TODO - discounts and policies */description?: string) {
    await prisma.shop.create({
        data: {
            id: id,
            name: name,
            status: status,
            shop_founder: shop_founder,
            rate: rate,
            description: description,
        },
    });

    for(const shop_owner of shop_owners)
        await createShopOwner(shop_owner, id);
    for(const shop_manager of shop_managers)
        await createShopManager(shop_manager, id);
}

async function createShopOwner(username: string, shopId: number) {
    await prisma.shopOwner.create({
        data: {
            username: username,
            shopId: shopId,
        },
    });
}

async function createShopManager(username: string, shopId: number) {
    await prisma.shopManager.create({
        data: {
            username: username,
            shopId: shopId,
        },
    });
}

async function createProductsInShop(shopId: number, productId: number, product_quantity: number) {
    await prisma.productInShop.create({
        data: {
            shopId: shopId,
            productId: productId,
            product_quantity: product_quantity,
        },
    });
}

async function createShoppingCart(username: string) {
    await prisma.shoppingCart.create({
        data: {
            username: username,
        },
    });
}

async function createShoppingBag(username: string, shopId: number, productId: number, quantity: number) {
    await prisma.shoppingBag.create({
        data: {
            username: username,
            shopId: shopId,
        },
    });

    await createProductsInShoppingBag(username, shopId, productId, quantity);
}

async function createProductsInShoppingBag(username: string, shopId: number, productId: number, product_quantity: number) {
    await prisma.productInBag.create({
        data: {
            username: username,
            shopId: shopId,
            productId: productId,
            product_quantity: product_quantity,
        },
    });
}

describe("prisma tests", ()=> {
    beforeAll(function () {
        prisma = new PrismaClient();
    })

    beforeEach(function () {

    })

    test("create member test", async () => {
        ["shmulik", "hayim", "yafit"].forEach(createMember);

        await createMemberCredentials("shmulik", "password");
        await createMemberCredentials("hayim", "password");
        await createMemberCredentials("yafit", "password");

        await prisma.$disconnect();

        // const members = await prisma.member.findMany({
        //     select: {
        //         username: true,
        //     },
        // })
        // console.dir(members, { depth: null })
    })

    test("create shopping_cart test", async () => {
        createShoppingCart("shmulik")
            .catch((e) => {
                throw e
            })
            .finally(async () => {
                await prisma.$disconnect()
            })
    })

    test("create shop test", async () => {
        createShop(0, "Best Shop", ShopStatus.open, "shmulik", ["shmulik", "hayim"], ["yafit"], ShopRate.NotRated, "Why would you shop anywhere else?")
            .catch((e) => {
                throw e
            })
            .finally(async () => {
                await prisma.$disconnect()
            })
    })

    test("create role test", async () => {
        createRole("shmulik", 0, JobType.Owner, [Permissions.AddPermission, Permissions.AddShopManager], "owner")
            .catch((e) => {
                throw e
            })
            .finally(async () => {
                await prisma.$disconnect()
            })
    })

    test("create product test", async () => {
        createProduct(1, "pizza", 0, ProductCategory.A, ProductRate.NotRated, 10, "It's tasty")
            .catch((e) => {
                throw e
            })
            .finally(async () => {
                await prisma.$disconnect()
            })
    })

    test("create shopping_bag test", async () => {
        createShoppingBag("shmulik", 0, 1, 5)
            .catch((e) => {
                throw e
            })
            .finally(async () => {
                await prisma.$disconnect()
            })
    })

    test("remove test", async () => {

    })
})