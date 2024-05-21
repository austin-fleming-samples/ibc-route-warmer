import * as Avatar from "@radix-ui/react-avatar";

export const LogoIcon = ({ src, alt }: { src: string; alt: string }) => {
	return (
		<Avatar.Root className="avatar h-[1em] rounded">
			<Avatar.Image src={src} alt={alt} />
		</Avatar.Root>
	);
};
