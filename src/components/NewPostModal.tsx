import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { ToastContainer, toast } from "react-toastify";

interface NewPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (title: string, content: string) => Promise<void>;
}

const NewPostModal: React.FC<NewPostModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    try {
      await onCreate(title, content);
      toast.success("Post created successfully!", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setTitle("");
      setContent("");
      onClose();
    } catch (error) {
      toast.error(`Failed to create post. Error: ${error.message}`, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (title || content) {
      setShowConfirmCancel(true);
    } else {
      onClose();
    }
  };

  const confirmCancel = () => {
    setTitle("");
    setContent("");
    setShowConfirmCancel(false);
    onClose();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleCancel}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Post</ModalHeader>
          <ModalBody>
            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              mb={4}
            />
            <Textarea
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="red"
              variant="outline"
              mr={3}
              onClick={handleCancel}
              isDisabled={loading}
            >
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleCreate}
              isLoading={loading}
            >
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {showConfirmCancel && (
        <Modal
          isOpen={showConfirmCancel}
          onClose={() => setShowConfirmCancel(false)}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Are you sure?</ModalHeader>
            <ModalBody>
              You have unsaved changes. Are you sure you want to discard them?
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="gray"
                variant="outline"
                mr={3}
                onClick={() => setShowConfirmCancel(false)}
              >
                No
              </Button>
              <Button colorScheme="red" onClick={confirmCancel}>
                Yes
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
      <ToastContainer />
    </>
  );
};

export default NewPostModal;
