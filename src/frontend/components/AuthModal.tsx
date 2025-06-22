import AuthForm from "@/frontend/components/AuthForm";
import React from "react";

interface AuthModalProps {
  show: boolean;
  onClose: () => void;
  mode: "signin" | "signup";
  loading: boolean;
  onSubmit: (data: any) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ show, onClose, mode, loading, onSubmit }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded shadow-lg p-6 relative">
        <button className="absolute top-2 right-2 text-xl" onClick={onClose}>&times;</button>
        <AuthForm mode={mode} loading={loading} onSubmit={onSubmit} />
      </div>
    </div>
  );
};

export default AuthModal;
