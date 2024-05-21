import { NumericInput } from "@/modules/shared/components/NumericInput";
import { useTransferContext } from "../Master/state";

export const AmountInput = () => {
	const { amount, setAmount } = useTransferContext();

	return (
		<label className="form-control w-full max-w-xs">
			<div className="label">
				<span className="label-text">Amount</span>
			</div>

			<NumericInput value={amount} onChange={(value) => setAmount(value)} />
		</label>
	);
};
