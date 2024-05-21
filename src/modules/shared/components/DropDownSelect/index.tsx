import { capitalizeFirstLetter } from "@/modules/shared/utils/string-formatting";
import * as Dialog from "@radix-ui/react-dialog";
import { ChevronDownIcon, Cross2Icon } from "@radix-ui/react-icons";
import { useState } from "react";
import { LogoIcon } from "../LogoIcon";

type Item = {
	icon?: string;
	label: string;
	value: string;
};

export const DropDownSelect = ({
	name,
	items,
	selected,
	setSelected,
}: {
	name: string;
	items: Item[];
	selected?: Item;
	setSelected: (item: Item) => void;
}) => {
	const [modalOpen, setModalOpen] = useState(false);

	return (
		<Dialog.Root open={modalOpen} onOpenChange={setModalOpen}>
			<Dialog.Trigger asChild>
				<button
					type="button"
					className="btn justify-between"
					aria-label="select"
				>
					{selected ? (
						<>
							{selected.icon ? (
								<LogoIcon src={selected.icon} alt={selected.label} />
							) : (
								<span />
							)}
							{selected.label}
						</>
					) : (
						<span className="opacity-50">
							Select {capitalizeFirstLetter(name)}
						</span>
					)}
					<ChevronDownIcon className="w-4 h-4 mr-2" />
				</button>
			</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay className="bg-slate-800/50 data-[state=open]:animate-overlayShow fixed inset-0" />
				<Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] h-[500px] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-base-100 p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none grid gap-2">
					<div className="border-b-2 bg-base-100">
						<Dialog.Title>Select {capitalizeFirstLetter(name)}</Dialog.Title>

						<Dialog.Close asChild>
							<button
								type="button"
								className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
								aria-label="Close"
							>
								<Cross2Icon />
							</button>
						</Dialog.Close>
					</div>

					<div className="flex flex-col gap-1 overflow-y-scroll">
						{items.map((item) => (
							<button
								key={item.value}
								type="button"
								className={`btn btn-lg ${
									selected && selected.value === item.value
										? "btn-primary"
										: "btn-ghost"
								}`}
								onClick={(e) => {
									e.preventDefault();
									setSelected(item);
									setModalOpen(false);
								}}
							>
								{item.icon && <LogoIcon src={item.icon} alt={item.label} />}
								{item.label}
							</button>
						))}
					</div>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
};
