import { fetchCurrentBalance, fetchPayouts, fetchProject } from "../../server-modules/firebase"
import { formatDollars, type SettingsProps } from "../../server-modules/util"
import Button from "../button"


export default async function PayoutsSettings({ projectId }: SettingsProps) {

    const currentBalance = await fetchCurrentBalance(projectId)
    const payouts = await fetchPayouts(projectId)

    return (
        <div
            class="flex flex-col gap-6 items-stretch"
        >
            <div class="flex items-center justify-between">
                <p>Current Balance: <strong>{formatDollars(currentBalance || 0, true)}</strong></p>

                <Button
                    color="green" class="text-xs"
                    hx-post={`/projects/${projectId}/payouts`}
                    hx-target="#payouts-table"
                    hx-select="#payouts-table"
                    hx-swap="outerHTML"
                    htmx="parent"
                >
                    Request Payout
                </Button>
            </div>

            <p class="text-sm text-light">
                Balance amount shown is gross revenue. Your actual payout will have platform fees subtracted.
            </p>

            <hr class="col-span-full" />

            <table id="payouts-table">
                <thead>
                    <tr>
                        <th>Date Requested</th>
                        <th>Date Paid</th>
                        <th>Status</th>
                        <th>Amount</th>
                        <th>Recipient</th>
                        <th>Method</th>
                        <th>Notes</th>
                    </tr>
                </thead>
                <tbody class="[&_td]:text-center [&_td]:py-1">
                    {payouts.map(payout => (
                        <tr>
                            <td>{new Date(payout._meta.createTime).toLocaleDateString(undefined, {
                                dateStyle: "short"
                            })}</td>
                            <td>{payout.payedAt ?
                                new Date(payout.payedAt).toLocaleDateString(undefined, {
                                    dateStyle: "short"
                                }) : ""}</td>
                            <td>{payout.status}</td>
                            <td>{formatDollars(payout.amount, true)}</td>
                            <td>{payout.recipient}</td>
                            <td>{payout.method}</td>
                            <td>{payout.notes}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>)
}