import {systemContainer} from "../../src/helpers/inversify.config";
import {Service} from "./Service";
import {TYPES} from "../../src/helpers/types";
import {StateInitializer} from "../../src/Server/StateInitializer";
import {SimpleMember} from "../../src/utilities/simple_objects/user/SimpleMember";
import {SimpleGuest} from "../../src/utilities/simple_objects/user/SimpleGuest";
import {SimpleShop} from "../../src/utilities/simple_objects/marketplace/SimpleShop";

const service: Service = systemContainer.get(TYPES.Service);
jest.setTimeout(50000)

describe('initialization test', function () {
    const stateInit = new StateInitializer(service, "no datasource at this moment");
    let testUser;

    beforeAll(async () => {
        const answer =  await stateInit.initialize()
        testUser = StateInitializer.getRandomFromList(stateInit.allMembers)
        console.log("init status: " + answer);

    })

    beforeEach(async () => {
        const acc_res = await service.accessMarketplace(testUser.sessionId);
        expect(acc_res.ok).toBe(true);
        expect(acc_res.data).toBeInstanceOf(SimpleGuest);
        expect(acc_res.data).toHaveProperty("guestID");

    })
    afterEach(async () => {
        await service.exitMarketplace(testUser.sessionId);
    })

    test('get login user', async () => {
        const login_res = await service.login(testUser.sessionId, testUser.username, testUser.password);
        expect(login_res.ok).toBe(true);
        expect(login_res.data).toBeDefined();
        expect((login_res.data as SimpleMember).username).toBe(testUser.username);
    })

    test('get one shop', async () => {
        const res = await service.getShopInfo(testUser.sessionId, 0)
        // expect(res).toBe(true);
        expect((res as SimpleShop).ID).toBe(0)

    })
    test('get all shops', async () => {
        const res = await service.getAllShopsInfo(testUser.sessionId)
        expect(res.ok).toBe(true);
        expect((res.data as []).length).toBeGreaterThan(0);
        console.log(res.data)
    })
});