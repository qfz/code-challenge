import { useCallback, useMemo, type FormEventHandler, type FunctionComponent } from "react";
import type { EnergyAccountWithBalance } from "../repositories/CompositeRepository";

interface Props {
    account: EnergyAccountWithBalance
    initiatePayment: (accountId: string) => void
}

/**
 * UI component for an energy account
 */
export const AccountCard: FunctionComponent<Props> = ({ account, initiatePayment }) => {

    const balanceCSSClass = useMemo(() => {
        if (account.balance === undefined) {
            return ""
        }

        if (account.balance === 0) {
            return "text-gray-500"
        }

        if (account.balance < 0) {
            return "text-red-500"
        }

        return "text-green-500"
    }, [account.balance])


    const handleSubmit = useCallback<FormEventHandler<HTMLFormElement>>((e) => {
        e.preventDefault();
        initiatePayment(account.id)

    }, [account.id, initiatePayment])

    return (
        <li className="flex not-last:mb-2 bg-amber-100 rounded-lg p-2">
            <div className="p-2">
                <span className="bg-yellow-500 p-2 aspect-square flex justify-center items-center rounded-full font-bold">ICON</span>
            </div>
            <div className="w-full flex flex-col px-2">
                <h2>{account.type}</h2>
                <p>{account.id}</p>
                <address>{account.address}</address>
                <p className="flex justify-between">
                    <span>Account Balance</span>
                    {
                        account.balance
                            ?
                            <span className={balanceCSSClass}>${account.balance}</span>
                            :
                            <span title="Could not find account balance, contact support.">--</span>
                    }
                </p>
                <form onSubmit={handleSubmit}>
                    <button type="submit">Make a payment</button>
                </form>
            </div>
        </li>
    );
}