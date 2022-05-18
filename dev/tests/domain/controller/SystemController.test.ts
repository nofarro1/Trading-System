import {SystemController} from "../../../src/domain/SystemController";
import {MessageController} from "../../../src/domain/notifications/MessageController"
import {MarketplaceController} from "../../../src/domain/marketplace/MarketplaceController";
import {PurchaseController} from "../../../src/domain/purchase/PurchaseController";
import {SecurityController} from "../../../src/domain/SecurityController";
import {UserController} from "../../../src/domain/user/UserController";
import {NotificationController} from "../../../src/domain/notifications/NotificationController";
import {IMessageListener} from "../../../src/domain/notifications/IEventPublishers";
import {ShopStatusChangedMessage} from "../../../src/domain/notifications/Message";


const mockDependencies = {
    SecurityController: "../../../src/domain/SecurityController",
    MessageController: "../../../src/domain/notifications/MessageController",
    MarketplaceController: "../../../src/domain/marketplace/MarketplaceController",
    PurchaseController: "../../../src/domain/purchase/PurchaseController",
    UserController: "../../../src/domain/user/UserController",
    NotificationController: "../../../src/domain/notifications/NotificationController",
}
const mockInstance = (dependency: string) => {
    jest.mock(dependency)
}

const mockMethod = <T extends {}>(obj: T, method: any, todoInstead: ((...args: jest.ArgsType<any>) => ReturnType<any>) | undefined) => {
    return jest.spyOn(obj, method).mockImplementation(todoInstead)
}


describe('system controller - unit', () => {
    let sys: SystemController;
    let mpController: MarketplaceController;
    let mController: MessageController;
    let pController: PurchaseController;
    let scController: SecurityController;
    let uController: UserController;
    let notificationsController: NotificationController;

    let mpControllerMockMethod: jest.SpyInstance<any, unknown[]>
    let mControllerMockMethod: jest.SpyInstance<any, unknown[]>
    let pControllerMockMethod: jest.SpyInstance<any, unknown[]>
    let scControllerMockMethod: jest.SpyInstance<any, unknown[]>
    let uControllerMockMethod: jest.SpyInstance<any, unknown[]>
    let notificationsControllerMockMethod: jest.SpyInstance<any, unknown[]>


    beforeAll(() => {


        //marketplace
        jest.mock(mockDependencies.MarketplaceController)
        //security
        jest.mock(mockDependencies.SecurityController)
        //message
        jest.mock(mockDependencies.MessageController)
        //purchase
        jest.mock(mockDependencies.PurchaseController)
        //user
        jest.mock(mockDependencies.UserController)
        //notification
        jest.mock(mockDependencies.NotificationController)

        pControllerMockMethod = mockMethod(MarketplaceController.prototype, 'subscribe', (sub) => {
            console.log(`subscribe has been called for marketplace`);
        })

        mpControllerMockMethod = mockMethod(PurchaseController.prototype, 'subscribe', (sub) => {
            console.log(`subscribe has been called for PurchaseController`);
        })

        scControllerMockMethod = mockMethod(SecurityController.prototype, 'isLoggedIn', (user) => {
            return true;
        })

        sys = SystemController.initialize();
        mpController = sys.mpController
        mController = sys.mController
        pController = sys.pController
        scController = sys.securityController
        uController = sys.uController
        notificationsController = sys.notifyController
    })

    test("initialize the system", () => {
        expect(sys.mpController).toBeDefined();
        expect(sys.pController).toBeDefined();
        expect(sys.scController).toBeDefined();
        expect(sys.uController).toBeDefined();
        expect(sys.mController).toBeDefined();
        expect(sys.securityController).toBeDefined();
        expect(sys.notifyController).toBeDefined();
        expect(mpControllerMockMethod).toBeCalledWith(mpController);
        expect(mpControllerMockMethod).toBeCalledTimes(1);
    })

    test("access marketplace test", () => {

    })

    test("exit marketplace test", () => {

    })

    test("login test", () => {

    })

    test("logout test", () => {

    })

    test("register member", () => {

    })

    test("get product", () => {

    })

    test("get shop", () => {

    })

    test("search product", () => {

    })
    test("add to cart", () => {

    })
    test("get cart", () => {

    })
    test("remove product from cart", () => {

    })
    test("checkout", () => {

    })
    test("setup shop", () => {

    })

    test("add product to shop", () => {

    })

    test("delete product", () => {

    })

    test("update product", () => {

    })

    test("appoint owner", () => {

    })

    test("appoint menager", () => {

    })

    test("update product", () => {

    })

    test("add permissions to shop Manager", () => {

    })
    test("remove shop manager permissions", () => {

    })
    test("deactivate shop", () => {

    })
    test("reactivate shop", () => {

    })
    test("update product", () => {

    })
    test("get shop info", () => {

    })
    test("get shop purchases", () => {

    })
    test("register admin", () => {

    })
    test("edit external connection service", () => {

    })
    test("swap external connection service", () => {

    })
    test("update product", () => {

    })
    test("update product", () => {

    })
    test("update product", () => {

    })
    test("update product", () => {

    })
    test("update product", () => {

    })
    test("update product", () => {

    })
    test("update product", () => {

    })
    test("update product", () => {

    })
    test("update product", () => {

    })

})