import type { ReactNode } from "react";

export const Layout = ({ children }: { children: ReactNode }) => (
	<>
		<header className="w-full p-2 py-[1rem] border-b-2 sticky top-0">
			<h1>Route Warmer</h1>
		</header>
		<main className="p-4 min-h-screen">{children}</main>
	</>
);
