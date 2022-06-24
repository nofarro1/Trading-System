import {Offer} from "../../../../src/domain/user/Offer";

describe('Offer.units', function(){
    let offer: Offer;

    beforeEach(()=>{
        offer = new Offer(0, "NofarRoz", 0, 0,4.5, new Set<string>().add("OfirPovi").add("EladIn"));
    })

    test("setAnswer", ()=>{
        expect(offer.getApproves().get("OfirPovi")).toEqual([false, true]);
        offer.setAnswer("OfirPovi", true);
        expect(offer.getApproves().get("OfirPovi")).toEqual([true, true]);
        offer.setAnswer("OfirPovi", false);
        expect(offer.getApproves().get("OfirPovi")).toEqual([true, false]);
        expect(offer.setAnswer("NofarRoz", false)).toThrow("Only a shop owner can approve a price offer.");
    })

    test("answer", ()=>{
        let map = new Map<string, [boolean, boolean]>();
        map.set("OfirPovi", [true, false]);
        map.set("EladIn", [true, true]);
        offer.approves_for_test(map);
        expect(offer.answer).toBe(false);
        map.set("OfirPovi", [false, false]);
        expect(offer.answer).toBe(true);

    })

    test("isDone", ()=>{
        let map = new Map<string, [boolean, boolean]>();
        map.set("OfirPovi", [true, false]);
        map.set("EladIn", [true, true]);
        offer.approves_for_test(map);
        expect(offer.isDone()).toBe(true);
        map.set("EladIn", [false, true]);
        expect(offer.isDone()).toBe(false);
    })

    test("approves", ()=>{
        let map = new Map<string, [boolean, boolean]>();
        map.set("OfirPovi", [true, false]);
        map.set("EladIn", [true, true]);
        offer.approves_for_test(map);
        offer.approves= new Set<string>().add("NofarRoz").add("OfirPovi");
        expect(offer.getApproves().has("EladIn")).toBe(false);
        expect(offer.getApproves().has("OfirPovi")).toBe(true);
        expect(offer.getApproves().get("OfirPovi")).toEqual([true, false]);
        expect(offer.getApproves().has("NofarRoz")).toBe(true);
        expect(offer.getApproves().get("NofarRoz")).toEqual([false, true]);
    })

    test("resetApproves", ()=>{
        let map = new Map<string, [boolean, boolean]>();
        map.set("OfirPovi", [true, false]);
        map.set("EladIn", [true, true]);
        offer.resetApproves();
        expect(offer.getApproves().get("EladIn")).toEqual([false, true]);
        expect(offer.getApproves().get("OfirPovi")).toEqual([false, true]);
    })
})