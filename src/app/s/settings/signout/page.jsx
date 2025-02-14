'use client'

import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@heroui/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

const Page = () => {
    const router = useRouter()
    const modal = useDisclosure()

    useEffect(() => {
        modal.onOpen()
    }, [])

    const handleSignOut = () => {
        localStorage.removeItem("token")
        window.location.href = "/"
    }

    return (
        <div className="h-screen w-screen flex items-center justify-center">
            <Modal
                backdrop="opaque"
                classNames={{
                    body: "py-6",
                    backdrop: "bg-slate-900/50 backdrop-opacity-40",
                    base: "border-slate-900 bg-slate-950 dark:bg-slate-950",
                    closeButton: "hover:bg-white/5 active:bg-white/10",
                }}
                isOpen={modal.isOpen}
                onOpenChange={modal.onOpenChange}
            >
                <ModalContent>
                    {() => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Sign Out</ModalHeader>
                            <ModalBody>
                                <p>
                                    Are you sure you want to sign out?
                                </p>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={handleSignOut}>
                                    Sign Out
                                </Button>
                                <Button className="bg-gradient-to-r from-purple-500 to-pink-700  text-white" onPress={() => router.back()}>
                                    Cancel
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    )
}

export default Page