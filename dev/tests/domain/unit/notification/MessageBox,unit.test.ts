import {MessageBox, ILLiveNotificationSubscriber} from "../../../../src/domain/notifications/MessageBox";
import {Message} from "../../../../src/domain/notifications/Message";
import {Member} from "../../../../src/domain/user/Member";
import {ShoppingCart} from "../../../../src/domain/user/ShoppingCart";
import {MessageController} from "../../../../src/domain/notifications/MessageController";

class TestMessage extends Message {
    constructor(recipients: Set<string>) {
        super(recipients, "i'm A test message");
    }
}

const id1 = "u1"
let cart1;
let tu1: Member;
let mb1 = new MessageBox(id1);

const sess1 = "1";
const sess2 = "2";
const id2 = "u2"
let cart2 = new ShoppingCart(sess2);
const tu2: Member = new Member(sess2, id2)
let mb2 = new MessageBox(id2);
let controller: MessageController

const recipients = new Set([id1])
const tm1 = new TestMessage(recipients);
const tm2 = new TestMessage(recipients);
const tm3 = new TestMessage(recipients);

describe('messageBox - test', function () {

    beforeEach(function () {
        mb1 = new MessageBox(id1);
    })

    test("added massage to box", () => {
        mb1.addMessage(tm1);
        expect(mb1.unreadMessages).toContain(tm1);
        expect(mb1.messages.length).toBe(0);
        expect(mb1.unreadMessages.length).toBe(1);
    })

    test("get massage from box", () => {
        mb1.addMessage(tm1);
        const mId = tm1.id;
        const message = mb1.getMessage(mId);
        expect(message).not.toBeNull();
        expect(message).toEqual(tm1);
        expect(mb1.messages).toContain(tm1);
        expect(mb1.messages.length).toBe(1);
        expect(mb1.unreadMessages.length).toBe(0);
    })

    test("get message - should throw", () => {
        mb1.addMessage(tm1);
        const mId = tm1.id;
        expect(() => mb1.getMessage("hi")).toThrow()
    })

    test("get all massages from box", () => {
        mb1.addMessage(tm1);
        mb1.addMessage(tm2);
        mb1.addMessage(tm3);
        expect(mb1.unreadMessages.length).toBe(3);
        expect(mb1.messages.length).toBe(0);

        let messages = mb1.getAllMessages();
        expect(messages.length).toBe(3);
        expect(mb1.unreadMessages.length).toBe(0);
    })

    test("remove message form box - in unread message", () => {
        mb1.addMessage(tm1);
        const mId = tm1.id;
        expect(mb1.unreadMessages).toContain(tm1);
        expect(mb1.unreadMessages.length).toBe(1);

        mb1.removeMessage(mId);
        expect(mb1.unreadMessages).not.toContain(tm1);
        expect(mb1.unreadMessages.length).toBe(0);
    })

    test("remove message from - in messages", () => {
        mb1.addMessage(tm1);
        const mId = tm1.id;
        expect(mb1.unreadMessages).toContain(tm1);
        expect(mb1.unreadMessages.length).toBe(1);
        const message = mb1.getMessage(mId);
        mb1.removeMessage(mId);
        expect(mb1.messages).not.toContain(tm1);
        expect(mb1.unreadMessages.length).toBe(0);
        expect(mb1.messages.length).toBe(0);
    })

    test("subscribe to mailbox and notify", () => {
        const onEvent = jest.fn();
        let sub: ILLiveNotificationSubscriber = {
            onNewMessages: onEvent
        } as ILLiveNotificationSubscriber;

        mb1.subscribe(sub);
        expect(mb1.subs).toContain(sub);
        mb1.addMessage(tm1)
        expect(onEvent).toBeCalledWith([tm1])


    })

    test("no sub unsub", () => {
        const onEvent = jest.fn();
        let sub: ILLiveNotificationSubscriber = {
            onNewMessages: onEvent
        } as ILLiveNotificationSubscriber;
        // mb1.subscribe(sub);
        // mb1.unsubscribe(sub);
        expect(mb1.subs).toHaveLength(0);
        mb1.addMessage(tm1)
        expect(onEvent).not.toBeCalledWith()
    })
});
