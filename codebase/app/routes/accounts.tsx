/* eslint-disable react-refresh/only-export-components */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { data, Form } from "react-router";
import { AccountCard } from "../accounts/AccountCard";
import { Errors } from "../misc/Errors";
import { defaultCompositeRepository, PaymentError } from "../repositories/CompositeRepository";
import { type Payment } from "../repositories/PaymentRepository";
import type { Route } from "./+types/accounts";

/**
 * This function loads the required data for this route's UI. It serves the same purpose as an API endpoint.
 * @param _ 
 * @returns 
 */
export async function loader() {
    return await defaultCompositeRepository.getAllEnergyAccountsWithBalance();
}


/**
 * This function run on the server side and it handles credit card payments. It serves the same purpose as a controller method.
 * @param param0 
 * @returns 
 */
export async function action({ request }: Route.ActionArgs) {
    const formData = await request.formData();
    const newPayment: Payment = Object.fromEntries(formData.entries()) as unknown as Payment;


    try {
        await defaultCompositeRepository.pay(newPayment);

        return data(newPayment)
    } catch (e) {
        const errors: Record<string, string> = {}

        if (e instanceof PaymentError) {
            errors.payment = e.message;
        }

        return data({ errors }, { status: 500 })
    }
}

/**
 * This renders a list of energy accounts
 */
export default function Accounts({ loaderData, actionData }: Route.ComponentProps) {

    // state variable for the account type dropdown
    const [selectedAccountType, setSelectedAccountType] = useState("")

    // find all the account types from the list of accounts
    const accountTypes = useMemo(() => {
        const types = loaderData.map(account => account.type)

        // Deduplicate account types
        return new Set(types)
    }, [loaderData])

    // This computes the list of <option /> tags to be rendered in the UI
    const accontTypeOptions = useMemo(() => {
        const options = []
        for (const accountType of accountTypes) {
            options.push(
                <option key={accountType} value={accountType}>{accountType}</option>
            )
        }

        return options;
    }, [accountTypes])


    // A filtered list of accounts based on the selected account type
    const filteredAccounts = useMemo(() => {
        if (selectedAccountType === "") {
            return loaderData;
        }

        const filteredAccounts = loaderData.filter(account => account.type === selectedAccountType)

        return filteredAccounts;

    }, [loaderData, selectedAccountType])


    const dialogRef = useRef<HTMLDialogElement>(null)
    const [targetAccountId, setTargetAccountId] = useState("");
    const openDialog = useCallback((accountId: string) => {
        setTargetAccountId(accountId);
        dialogRef.current?.showModal();
    }, [])

    const closeDialog = useCallback(() => {
        dialogRef.current?.close();
    }, [])

    useEffect(() => {
        if (!actionData) {
            return;
        }

        if ("errors" in actionData) {
            if (Object.keys(actionData.errors).length > 0) {
                // There are errors, don't close the modal dialog.
                return;
            }
        }

        // No errors, close the modal dialog.
        closeDialog();
    }, [actionData, closeDialog])

    return (
        <>
            <div className="max-w-2xl m-auto">
                <div className="flex justify-end">
                    <select value={selectedAccountType} onChange={e => setSelectedAccountType(e.target.value)}>
                        <option value="">All accounts</option>
                        {accontTypeOptions}
                    </select>
                </div>
                <ol>
                    {
                        filteredAccounts.map(account => (
                            <AccountCard key={account.id} account={account} initiatePayment={openDialog}></AccountCard>
                        ))
                    }
                </ol>
            </div>
            <dialog className="rounded-lg" ref={dialogRef}>
                <Form className="grid grid-cols-2 gap-2 relative" method="post">
                    <button className="absolute top-0 right-0" value="cancel" type="button" onClick={closeDialog}>✖</button>
                    <h2 className="col-span-2">Make a payment</h2>
                    {
                        (actionData && "errors" in actionData)
                            ?
                            <div className="col-span-2">
                                <Errors errors={actionData.errors}></Errors>
                            </div>
                            :
                            <></>
                    }
                    <label className="col-span-2" htmlFor="amount">
                        How much would you like to pay?
                    </label>
                    <input className="mb-4" type="number" placeholder="Amount" name="amount" id="amount" min={1} required></input>
                    <label className="col-span-2" htmlFor="creditCardNumber">
                        How would you like to pay?
                    </label>
                    <input className="col-span-2" type="text" inputMode="numeric" placeholder="Card number" name="creditCardNumber" id="creditCardNumber" minLength={16} maxLength={16} required></input>
                    <input type="date" placeholder="Expiry" required></input>
                    <input type="text" inputMode="numeric" pattern="[0-9]*" placeholder="CVV" maxLength={3} required></input>
                    <input hidden={true} value={targetAccountId} name="accountId" id="accountId" readOnly></input>
                    <button className="col-span-2" type="submit">Pay</button>
                </Form>
            </dialog>
        </>
    );
}