import React from 'react'
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Login from '@/pages/auth/Login';
interface Props {
  open: boolean;
  close: () => void;
}
const DialogLoginComment = ({open,close}:Props) => {
  return (
		<div>
			<Dialog open={open} onOpenChange={close}>
				<DialogContent className="sm:max-w-[425px]">
					<Login/>
				</DialogContent>
			</Dialog>
		</div>
	);
}

export default DialogLoginComment