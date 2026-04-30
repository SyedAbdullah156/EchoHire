"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiAlertTriangle, FiX } from "react-icons/fi";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
  title?: string;
  description?: string;
}

export default function DeleteAccountModal({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
  title = "Delete Account",
  description = "This action is irreversible. All your data, including projects, resumes, and interview history, will be permanently deleted.",
}: DeleteAccountModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md overflow-hidden rounded-[2.5rem] border border-red-500/20 bg-surface-2 p-8 shadow-2xl"
          >
            <div className="flex flex-col items-center text-center space-y-6">
              {/* Icon */}
              <div className="h-20 w-20 rounded-[2rem] bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 text-3xl">
                <FiAlertTriangle />
              </div>

              {/* Text */}
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-foreground tracking-tight">{title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed px-4">
                  {description}
                </p>
              </div>

              {/* Actions */}
              <div className="w-full space-y-3 pt-4">
                <button
                  onClick={onConfirm}
                  disabled={isDeleting}
                  className="w-full h-14 rounded-2xl bg-red-600 text-foreground text-sm font-black uppercase tracking-widest hover:bg-red-500 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {isDeleting ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Erasing Data...
                    </>
                  ) : (
                    "Confirm Deletion"
                  )}
                </button>
                <button
                  onClick={onClose}
                  disabled={isDeleting}
                  className="w-full h-14 rounded-2xl bg-surface-2 border border-border-medium text-foreground text-sm font-bold hover:bg-surface-2 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="absolute top-6 right-6 p-2 rounded-xl text-text-muted hover:text-foreground hover:bg-surface-2 transition-all"
            >
              <FiX size={20} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
